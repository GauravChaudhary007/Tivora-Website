<?php
// Brevo (email tool) client: one list per Outcome, unsubscribes read back.

function brevo_configured($cfg) {
    return !empty($cfg['brevo_api_key']) && !empty($cfg['brevo_list_ids']) && is_array($cfg['brevo_list_ids']);
}

function brevo_call($cfg, $method, $path, $data = null) {
    $base = rtrim(!empty($cfg['brevo_base']) ? $cfg['brevo_base'] : 'https://api.brevo.com/v3', '/');
    return http_json($method, $base . $path, array('api-key: ' . $cfg['brevo_api_key']), $data, 10);
}

// Puts the contact in the list for $outcome (Deal|Potential|Nurturing) and removes it from the other two.
// Returns array('ok','error').
function brevo_set_outcome($cfg, $name, $company, $email, $outcome) {
    $ids = $cfg['brevo_list_ids'];
    $key = strtolower($outcome);
    if (empty($ids[$key])) return array('ok' => false, 'error' => 'no list id for ' . $outcome);
    $parts = preg_split('/\s+/', trim($name), 2);
    $attrs = array('FIRSTNAME' => $parts[0]);
    if (isset($parts[1])) $attrs['LASTNAME'] = $parts[1];
    $r = brevo_call($cfg, 'POST', '/contacts', array('email' => $email, 'attributes' => $attrs, 'listIds' => array((int) $ids[$key]), 'updateEnabled' => true));
    if (!http_ok($r)) return array('ok' => false, 'error' => 'upsert: ' . http_err($r));
    $others = array();
    foreach ($ids as $k => $id) if ($k !== $key && $id) $others[] = (int) $id;
    if ($others) {
        $r = brevo_call($cfg, 'PUT', '/contacts/' . rawurlencode($email), array('unlinkListIds' => $others));
        if (!http_ok($r)) return array('ok' => false, 'error' => 'unlink: ' . http_err($r));
    }
    return array('ok' => true, 'error' => '');
}

// Lowercase emails of contacts modified since $since (ISO, '' = all) that are blacklisted (unsubscribed). null on failure.
function brevo_blacklisted($cfg, $since) {
    $out = array();
    for ($off = 0, $page = 0; $page < 50; $page++, $off += 500) {
        $q = '?limit=500&offset=' . $off . ($since !== '' ? '&modifiedSince=' . rawurlencode($since) : '');
        $r = brevo_call($cfg, 'GET', '/contacts' . $q);
        if (!http_ok($r) || !isset($r['json']['contacts'])) return null;
        foreach ($r['json']['contacts'] as $c) if (!empty($c['emailBlacklisted'])) $out[] = strtolower($c['email']);
        if (count($r['json']['contacts']) < 500) break;
    }
    return $out;
}
