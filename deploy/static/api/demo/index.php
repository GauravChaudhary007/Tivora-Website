<?php
// Lead capture endpoint (PHP 7.4+). Replaces the Next.js /api/demo route on cPanel.
// Flow: validate -> spam checks -> dedupe -> queue (never lose a lead) -> score -> answer the visitor
// -> then deliver to the Excel sheet and Teams (and legacy mail/webhook) in the same request.
header('Content-Type: application/json; charset=utf-8');

$D = dirname(__FILE__);
foreach (array('http', 'score', 'queue', 'graph', 'teams', 'deliver') as $m) require_once $D . '/lead/' . $m . '.php';

function out($code, $body) {
    http_response_code($code);
    echo json_encode($body);
    exit;
}

// Control chars (newlines only in the message) and angle brackets removed, then trimmed and length-capped.
function field($arr, $key, $max, $multiline = false) {
    $s = (isset($arr[$key]) && is_string($arr[$key])) ? $arr[$key] : '';
    $s = preg_replace($multiline ? '/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/', ' ', $s);
    $s = trim(str_replace(array('<', '>'), '', $s));
    return function_exists('mb_substr') ? mb_substr($s, 0, $max, 'UTF-8') : substr($s, 0, $max);
}

function choice($arr, $key, $allowed) {
    $v = (isset($arr[$key]) && is_string($arr[$key])) ? $arr[$key] : '';
    return in_array($v, $allowed, true) ? $v : '';
}

// Answer the visitor now and let the rest of the script keep running.
function respond_and_continue($payload) {
    ignore_user_abort(true);
    @set_time_limit(60);
    $json = json_encode($payload);
    http_response_code(200);
    header('Content-Length: ' . strlen($json));
    header('Connection: close');
    echo $json;
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        while (ob_get_level() > 0) @ob_end_flush();
        flush();
    }
}

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') out(405, array('error' => 'Invalid request.'));

$body = json_decode(file_get_contents('php://input', false, null, 0, 65536), true);
if (!is_array($body)) out(400, array('error' => 'Invalid request.'));

$cfgFile = $D . '/config.php';
$cfg = is_file($cfgFile) ? include $cfgFile : array();
if (!is_array($cfg)) $cfg = array();
$rules = lead_load_rules($D . '/lead-rules.json');
if (!$rules) out(500, array('error' => "We couldn't process your request right now."));

// Honeypot: bots fill the hidden field. Answer ok and keep nothing.
if (isset($body['website']) && $body['website'] !== '' && $body['website'] !== null) {
    drop_log($cfg, 'honeypot');
    out(200, array('ok' => true));
}

$utm = (isset($body['utm']) && is_array($body['utm'])) ? $body['utm'] : array();
$consent = isset($body['marketingConsent']) && ($body['marketingConsent'] === true || $body['marketingConsent'] === 'true' || $body['marketingConsent'] === 1);
$lead = array(
    'name'            => field($body, 'name', 120),
    'company'         => field($body, 'company', 160),
    'phone'           => field($body, 'phone', 40),
    'email'           => field($body, 'email', 160),
    'industry'        => field($body, 'industry', 60),
    'city'            => field($body, 'city', 80),
    'message'         => field($body, 'message', 2000, true),
    'timeline'        => choice($body, 'timeline', array('1m', '1-3m', 'exploring')),
    'businessSize'    => choice($body, 'businessSize', array('small', 'medium', 'large')),
    'currentSoftware' => choice($body, 'currentSoftware', array('excel', 'other-erp', 'hitech', 'none')),
    'marketingConsent' => $consent,
    'consentText'     => $consent ? field($body, 'consentText', 20) : '',
    'consentAt'       => $consent ? gmdate('c') : '',
    'utm'             => array('source' => field($utm, 'source', 80), 'medium' => field($utm, 'medium', 80), 'campaign' => field($utm, 'campaign', 80)),
    'landing'         => field($body, 'landing', 200),
    'referrer'        => field($body, 'referrer', 300),
);

if ($lead['name'] === '' || ($lead['phone'] === '' && $lead['email'] === '')) {
    out(422, array('error' => 'Please share your name and a phone number or email.'));
}
if ($lead['email'] !== '' && !filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
    out(422, array('error' => 'Please enter a valid email address.'));
}

$targets = delivery_targets($cfg);
if (!$targets) {
    out(503, array('error' => "Online requests aren't switched on yet. Please call us or email info@hitechnepal.com.np."));
}

// Too-fast submit (bot) and per-IP rate limit: answer ok, keep nothing.
if (isset($body['startedAt']) && is_numeric($body['startedAt']) && $body['startedAt'] > 1000000000000) {
    $elapsed = microtime(true) - $body['startedAt'] / 1000;
    if ($elapsed >= 0 && $elapsed < $rules['minFillSeconds']) { drop_log($cfg, 'too fast'); out(200, array('ok' => true)); }
}
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
if (rate_limited($cfg, $ip, $rules['rateLimit']['perIpPerHour'])) { drop_log($cfg, 'rate limit'); out(200, array('ok' => true)); }

$sc = score_lead($lead, $rules);
if ($sc['spam']) { drop_log($cfg, 'spam: ' . $sc['spamReason']); out(200, array('ok' => true)); }

$pending = array();
foreach ($targets as $t) $pending[$t] = array('status' => 'pending', 'attempts' => 0);
$now = gmdate('c');
$rec = array('id' => 'L-' . gmdate('ymd') . '-' . strtoupper(bin2hex(random_bytes(3))), 'receivedAt' => $now, 'updatedAt' => $now,
    'lead' => $lead, 'score' => $sc['score'], 'priority' => $sc['priority'], 'sla' => $sc['sla'], 'reasons' => $sc['reasons'],
    'repeat' => 0, 'delivery' => $pending);

// Dedupe by phone/email within N days: merge into the existing record and bump it, otherwise append.
$id = '';
$queued = q_mutate($cfg, function (&$recs) use (&$rec, $lead, $rules, $pending, $now) {
    $dup = q_find_dup($recs, $lead, $rules, $rules['dedupeDays']);
    if ($dup !== '') {
        foreach ($recs as $i => $old) {
            if ($old['id'] !== $dup) continue;
            $merged = $old['lead'];
            foreach ($lead as $k => $v) {
                if ($k === 'utm') { foreach ($v as $uk => $uv) if ($uv !== '' && $merged['utm'][$uk] === '') $merged['utm'][$uk] = $uv; }
                elseif ($k === 'marketingConsent' || $k === 'consentText' || $k === 'consentAt') { if ($lead['marketingConsent'] && !$merged['marketingConsent']) $merged[$k] = $v; }
                elseif ($v !== '' && $v !== false) $merged[$k] = $v;
            }
            $s = score_lead($merged, $rules);
            $score = min(100, max($old['score'], $s['score']) + $rules['weights']['repeatBonus']);
            $band = lead_band($score, $rules);
            $reasons = $s['reasons'];
            $reasons[] = 'Repeat inquiry +' . $rules['weights']['repeatBonus'];
            foreach ($pending as $t => $d) {
                $keep = isset($old['delivery'][$t]) ? $old['delivery'][$t] : array();
                $pending[$t] = array_merge($keep, array('status' => 'pending'));
            }
            $rec = array_merge($old, array('updatedAt' => $now, 'lead' => $merged, 'score' => $score, 'priority' => $band['priority'], 'sla' => $band['sla'],
                'reasons' => $reasons, 'repeat' => $old['repeat'] + 1, 'delivery' => $pending));
            $recs[$i] = $rec;
            return true;
        }
    }
    $recs[] = $rec;
    return true;
});

if (!$queued) {
    // Queue unusable (disk/permissions): fall back to delivering synchronously so the lead is still not lost.
    $ok = deliver_record($cfg, $rules, $rec);
    out($ok ? 200 : 502, $ok ? array('ok' => true) : array('error' => "We couldn't send your request right now."));
}

respond_and_continue(array('ok' => true));
deliver_record($cfg, $rules, $rec);
