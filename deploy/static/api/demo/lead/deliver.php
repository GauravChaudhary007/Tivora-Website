<?php
// Delivers one queued lead to every configured target, each independently, storing the status on the queue record.
// Used by index.php (right after the visitor got their answer) and by sync.php retry.

function lead_one_line($s) { return str_replace(array("\r", "\n"), ' ', $s); }

// Targets that apply for this config. Legacy mail/webhook only when neither Graph nor Teams is set up.
function delivery_targets($cfg) {
    $t = array();
    if (graph_configured($cfg)) $t[] = 'graph';
    if (!empty($cfg['teams_webhook_url'])) $t[] = 'teams';
    if (!$t) {
        if (!empty($cfg['to_email']) && $cfg['to_email'] !== 'sales@example.com') $t[] = 'mail';
        if (!empty($cfg['webhook_url'])) $t[] = 'webhook';
    }
    return $t;
}

function legacy_mail($cfg, $rec) {
    $l = $rec['lead'];
    if (!function_exists('mail')) return array('ok' => false, 'error' => 'mail() missing');
    $text = '';
    foreach (array('name', 'company', 'phone', 'email', 'industry', 'city', 'message') as $k) $text .= ucfirst($k) . ': ' . lead_one_line($l[$k]) . "\n";
    $text .= 'Priority: ' . $rec['priority'] . ' (' . $rec['score'] . ")\n";
    $from = !empty($cfg['from_email']) ? $cfg['from_email'] : 'no-reply@localhost';
    $h = 'From: Tivora Website <' . lead_one_line($from) . ">\r\nContent-Type: text/plain; charset=utf-8";
    if ($l['email'] !== '') $h .= "\r\nReply-To: " . lead_one_line($l['email']);
    $ok = @mail($cfg['to_email'], 'Tivora demo request - ' . lead_one_line($l['name']), $text, $h);
    return array('ok' => (bool) $ok, 'error' => $ok ? '' : 'mail() failed');
}

function legacy_webhook($cfg, $rec) {
    $l = $rec['lead'];
    $body = array('name' => $l['name'], 'company' => $l['company'], 'phone' => $l['phone'], 'email' => $l['email'], 'industry' => $l['industry'],
        'city' => $l['city'], 'message' => $l['message'], 'source' => 'tivora-website', 'receivedAt' => $rec['receivedAt'],
        'priority' => $rec['priority'], 'score' => $rec['score']);
    $r = http_json('POST', $cfg['webhook_url'], array(), $body, 8);
    return array('ok' => http_ok($r), 'error' => http_ok($r) ? '' : http_err($r));
}

function deliver_target($name, $cfg, $rules, $rec) {
    if ($name === 'graph') return graph_deliver($cfg, $rules, $rec);
    if ($name === 'teams') return teams_deliver($cfg, $rules, $rec);
    if ($name === 'mail') return legacy_mail($cfg, $rec);
    return legacy_webhook($cfg, $rec);
}

// Attempts every target not yet 'ok'. Returns true when all targets are ok.
function deliver_record($cfg, $rules, $rec) {
    $all = true;
    foreach (delivery_targets($cfg) as $t) {
        $d = isset($rec['delivery'][$t]) ? $rec['delivery'][$t] : array('status' => 'pending', 'attempts' => 0);
        if ($d['status'] === 'ok') continue;
        $res = deliver_target($t, $cfg, $rules, $rec);
        $d['attempts'] = (isset($d['attempts']) ? $d['attempts'] : 0) + 1;
        $d['status'] = $res['ok'] ? 'ok' : 'failed';
        $d['at'] = gmdate('c');
        $d['error'] = $res['error'];
        if ($res['ok'] && $t === 'graph') $d['rowAdded'] = true;
        if (!$res['ok']) $all = false;
        q_update($cfg, $rec['id'], function ($r) use ($t, $d) { $r['delivery'][$t] = $d; return $r; });
        $rec['delivery'][$t] = $d;
    }
    return $all;
}
