<?php
// Cron worker (CLI only):  php sync.php retry|outcomes|whatsapp|all [--force]
//   retry     re-delivers queued leads whose sheet row / Teams card / mail failed
//   outcomes  reads the sheet: Outcome -> Brevo list, Brevo unsubscribes -> sheet, WhatsApp done ticks -> Last WhatsApp sent
//   whatsapp  posts the once-a-day "WhatsApp to send" list to Teams
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

$D = dirname(__FILE__);
foreach (array('http', 'score', 'queue', 'graph', 'teams', 'deliver', 'brevo', 'whatsapp') as $m) require_once $D . '/lead/' . $m . '.php';

$cfg = is_file($D . '/config.php') ? include $D . '/config.php' : array();
$cfg = is_array($cfg) ? $cfg : array();
$rules = lead_load_rules($D . '/lead-rules.json');
$mode = isset($argv[1]) ? $argv[1] : 'all';
$force = in_array('--force', $argv, true);
if (!$rules || !in_array($mode, array('retry', 'outcomes', 'whatsapp', 'all'), true)) { fwrite(STDERR, "usage: php sync.php retry|outcomes|whatsapp|all [--force]\n"); exit(2); }

function say($s) { echo gmdate('c') . ' ' . $s . "\n"; }

function state_load($cfg) {
    $s = @json_decode((string) @file_get_contents(lead_data_dir($cfg) . '/sync-state.json'), true);
    return is_array($s) ? $s : array('outcomes' => array(), 'brevoSince' => '', 'waDate' => '');
}
function state_save($cfg, $s) { file_put_contents(lead_data_dir($cfg) . '/sync-state.json', json_encode($s), LOCK_EX); }

function sync_retry($cfg, $rules) {
    $min = isset($cfg['retry_min_age']) ? (int) $cfg['retry_min_age'] : 120;
    $n = 0;
    foreach (q_all($cfg) as $rec) {
        if (time() - strtotime($rec['updatedAt']) < $min) continue; // its own request may still be delivering
        $todo = false;
        foreach (delivery_targets($cfg) as $t) {
            $d = isset($rec['delivery'][$t]) ? $rec['delivery'][$t] : array('status' => 'pending', 'attempts' => 0);
            if ($d['status'] !== 'ok' && $d['attempts'] < 20) $todo = true;
        }
        if (!$todo) continue;
        $n++;
        say('retry ' . $rec['id'] . ': ' . (deliver_record($cfg, $rules, $rec) ? 'delivered' : 'still failing'));
    }
    say("retry: $n queued lead(s) retried");
}

// Reads the sheet and applies ticks, unsubscribes and (when $brevo) Outcome -> Brevo list. Returns the rows (with changes applied) or null.
function sync_sheet($cfg, $rules, $brevo) {
    $err = '';
    $rows = graph_list_rows($cfg, $rules, $err);
    if ($rows === null) { say('sheet read failed: ' . $err); return null; }
    $st = state_load($cfg);
    $now = gmdate('c');
    $today = np_today();
    $blocked = array();
    if ($brevo && brevo_configured($cfg)) {
        $bl = brevo_blacklisted($cfg, $st['brevoSince']);
        if ($bl === null) say('brevo unsubscribe read failed');
        else { $blocked = array_flip($bl); $st['brevoSince'] = $now; }
    }
    foreach ($rows as $i => $r) {
        $row = $r['row'];
        $ch = array();
        if (sheet_truthy($row['WhatsApp done'])) { $ch['Last WhatsApp sent'] = $today; $ch['WhatsApp done'] = ''; }
        $email = strtolower(trim($row['Email']));
        if ($email !== '' && isset($blocked[$email]) && !sheet_truthy($row['Unsubscribed'])) { $ch['Unsubscribed'] = 'Yes'; $row['Unsubscribed'] = 'Yes'; }
        $oc = trim($row['Outcome']);
        if ($brevo && brevo_configured($cfg) && in_array($oc, $rules['outcomes'], true) && $email !== ''
            && trim((string) $row['Marketing consent (timestamp)']) !== '' && !sheet_truthy($row['Unsubscribed'])
            && (!isset($st['outcomes'][$row['Lead ID']]) || $st['outcomes'][$row['Lead ID']] !== $oc)) {
            $res = brevo_set_outcome($cfg, $row['Name'], $row['Company'], $email, $oc);
            say('brevo ' . $row['Lead ID'] . ' -> ' . $oc . ': ' . ($res['ok'] ? 'ok' : $res['error']));
            if ($res['ok']) { $st['outcomes'][$row['Lead ID']] = $oc; $ch['Last synced'] = $now; }
        }
        if ($ch) {
            if (!isset($ch['Last synced'])) $ch['Last synced'] = $now;
            // ponytail: whole-row PATCH; a sales edit in the same second can be lost. Fine at this volume.
            $res = graph_patch_row($cfg, $rules, $r['index'], $r['row'], $ch);
            if (!$res['ok']) say('sheet update failed for ' . $row['Lead ID'] . ': ' . $res['error']);
            else $rows[$i]['row'] = array_merge($r['row'], $ch);
        }
    }
    state_save($cfg, $st);
    return $rows;
}

function sync_whatsapp($cfg, $rules, $rows, $force) {
    if (empty($cfg['teams_webhook_url'])) { say('whatsapp: no Teams webhook configured'); return; }
    $st = state_load($cfg);
    $today = np_today();
    $hour = isset($cfg['whatsapp_hour']) ? (int) $cfg['whatsapp_hour'] : 9;
    $nowNp = new DateTime('now', new DateTimeZone('Asia/Kathmandu'));
    if (!$force && ($st['waDate'] === $today || (int) $nowNp->format('G') < $hour)) { say('whatsapp: not due to post yet'); return; }
    $due = whatsapp_due($rows, $rules, $today);
    if ($due) {
        $res = teams_post($cfg, whatsapp_card($due, $rules));
        if (!$res['ok']) { say('whatsapp post failed: ' . $res['error']); return; }
    }
    $st['waDate'] = $today;
    state_save($cfg, $st);
    say('whatsapp: ' . count($due) . ' to send');
}

if ($mode === 'retry' || $mode === 'all') sync_retry($cfg, $rules);
if (graph_configured($cfg)) {
    $rows = null;
    if ($mode === 'outcomes' || $mode === 'all') { $rows = sync_sheet($cfg, $rules, true); say('outcomes: ' . ($rows === null ? 'failed' : 'done')); }
    if (($mode === 'whatsapp' || $mode === 'all')) {
        if ($mode === 'whatsapp') $rows = sync_sheet($cfg, $rules, false); // ticks first, so ticked rows are not listed again
        if ($rows !== null) sync_whatsapp($cfg, $rules, $rows, $force);
    }
} elseif ($mode !== 'retry') {
    say('Graph is not configured: nothing to sync');
}
