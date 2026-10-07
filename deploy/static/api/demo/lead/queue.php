<?php
// Local lead queue (NDJSON, one lead per line) plus rate limiting and the drop log.
// A lead is written here BEFORE any external service is called, so it is never lost.
// ponytail: every mutation rewrites the file under an exclusive lock; fine to a few thousand leads, move to SQLite beyond.

function lead_data_dir($cfg) {
    $d = !empty($cfg['data_dir']) ? $cfg['data_dir'] : dirname(__FILE__) . '/../data';
    if (!is_dir($d)) @mkdir($d, 0775, true);
    return $d;
}

// Runs $fn(&$records) under an exclusive lock and saves if it returns true. Returns false when the queue is unusable.
function q_mutate($cfg, $fn) {
    $path = lead_data_dir($cfg) . '/leads.ndjson';
    $fh = @fopen($path, 'c+');
    if (!$fh) return false;
    flock($fh, LOCK_EX);
    $recs = array();
    $raw = stream_get_contents($fh);
    foreach (explode("\n", (string) $raw) as $line) {
        $r = $line === '' ? null : json_decode($line, true);
        if (is_array($r)) $recs[] = $r;
    }
    $ok = true;
    if ($fn($recs)) {
        $out = '';
        foreach ($recs as $r) $out .= json_encode($r) . "\n";
        ftruncate($fh, 0);
        rewind($fh);
        $ok = fwrite($fh, $out) === strlen($out);
        fflush($fh);
    }
    flock($fh, LOCK_UN);
    fclose($fh);
    return $ok;
}

function q_all($cfg) {
    $all = array();
    q_mutate($cfg, function (&$recs) use (&$all) { $all = $recs; return false; });
    return $all;
}

function q_update($cfg, $id, $fn) {
    return q_mutate($cfg, function (&$recs) use ($id, $fn) {
        foreach ($recs as $i => $r) if ($r['id'] === $id) { $recs[$i] = $fn($r); return true; }
        return false;
    });
}

function lead_key_phone($phone, $rules) {
    $d = phone_info($phone, $rules);
    return strlen($d['digits']) >= 7 ? substr($d['digits'], -9) : '';
}

// Finds a lead received within $days with the same phone or email; returns its id or ''.
function q_find_dup($recs, $lead, $rules, $days) {
    $kp = lead_key_phone($lead['phone'], $rules);
    $ke = strtolower($lead['email']);
    $since = time() - $days * 86400;
    for ($i = count($recs) - 1; $i >= 0; $i--) {
        $r = $recs[$i];
        if (strtotime($r['receivedAt']) < $since) continue;
        if ($kp !== '' && lead_key_phone($r['lead']['phone'], $rules) === $kp) return $r['id'];
        if ($ke !== '' && strtolower($r['lead']['email']) === $ke) return $r['id'];
    }
    return '';
}

// True when this IP already made $max requests in the last hour (records this one otherwise).
function rate_limited($cfg, $ip, $max) {
    $dir = lead_data_dir($cfg) . '/rate';
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    $fh = @fopen($dir . '/' . sha1($ip) . '.json', 'c+');
    if (!$fh) return false;
    flock($fh, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fh), true);
    $now = time();
    $hits = array_values(array_filter(is_array($hits) ? $hits : array(), function ($t) use ($now) { return $t > $now - 3600; }));
    $limited = count($hits) >= $max;
    if (!$limited) $hits[] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $limited;
}

function drop_log($cfg, $reason) {
    @file_put_contents(lead_data_dir($cfg) . '/dropped.log', gmdate('c') . ' ' . $reason . "\n", FILE_APPEND | LOCK_EX);
}
