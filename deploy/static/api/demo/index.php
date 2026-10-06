<?php
// PHP replacement for the Next.js /api/demo route (same request/response shape).
// Written to run on old PHP (5.4+) and without optional extensions.
header('Content-Type: application/json; charset=utf-8');

function out($code, $body) {
    http_response_code($code);
    echo json_encode($body);
    exit;
}

// Same rules as src/app/api/demo/route.ts: control chars (newlines only in the
// message) and angle brackets removed, then trimmed and length-capped.
function field($arr, $key, $max, $multiline = false) {
    $s = (isset($arr[$key]) && is_string($arr[$key])) ? $arr[$key] : '';
    $s = preg_replace($multiline ? '/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/', ' ', $s);
    $s = trim(str_replace(array('<', '>'), '', $s));
    if (function_exists('mb_substr')) return mb_substr($s, 0, $max, 'UTF-8');
    return substr($s, 0, $max);
}

function one_line($s) {
    return str_replace(array("\r", "\n"), ' ', $s);
}

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    out(405, array('error' => 'Invalid request.'));
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) out(400, array('error' => 'Invalid request.'));

$lead = array(
    'name'       => field($body, 'name', 120),
    'company'    => field($body, 'company', 160),
    'phone'      => field($body, 'phone', 40),
    'email'      => field($body, 'email', 160),
    'industry'   => field($body, 'industry', 60),
    'city'       => field($body, 'city', 80),
    'message'    => field($body, 'message', 2000, true),
    'source'     => 'tivora-website',
    'receivedAt' => gmdate('c'),
);

if ($lead['name'] === '' || ($lead['phone'] === '' && $lead['email'] === '')) {
    out(422, array('error' => 'Please share your name and a phone number or email.'));
}
if ($lead['email'] !== '' && !filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
    out(422, array('error' => 'Please enter a valid email address.'));
}

$cfgFile = dirname(__FILE__) . '/config.php';
$cfg = is_file($cfgFile) ? include $cfgFile : array();
if (!is_array($cfg)) $cfg = array();
$to      = isset($cfg['to_email']) ? $cfg['to_email'] : '';
$from    = !empty($cfg['from_email']) ? $cfg['from_email'] : 'no-reply@localhost';
$webhook = isset($cfg['webhook_url']) ? $cfg['webhook_url'] : '';

$mailOk = ($to !== '' && $to !== 'sales@example.com');
if (!$mailOk && $webhook === '') {
    out(503, array('error' => "Online requests aren't switched on yet. Please call us or email info@hitechnepal.com.np."));
}

$ok = false;

if ($mailOk && function_exists('mail')) {
    $text = '';
    foreach ($lead as $k => $v) $text .= ucfirst($k) . ': ' . one_line($v) . "\n";
    $headers = 'From: Tivora Website <' . one_line($from) . ">\r\n" .
               'Content-Type: text/plain; charset=utf-8';
    if ($lead['email'] !== '') $headers .= "\r\nReply-To: " . one_line($lead['email']);
    $subject = 'Tivora demo request - ' . one_line($lead['name']);
    if (@mail($to, $subject, $text, $headers)) $ok = true;
}

if ($webhook !== '') {
    $ctx = stream_context_create(array('http' => array(
        'method' => 'POST', 'header' => "Content-Type: application/json\r\n",
        'content' => json_encode($lead), 'timeout' => 8, 'ignore_errors' => true,
    )));
    if (@file_get_contents($webhook, false, $ctx) !== false) $ok = true;
}

if (!$ok) out(502, array('error' => "We couldn't send your request right now."));
out(200, array('ok' => true));
