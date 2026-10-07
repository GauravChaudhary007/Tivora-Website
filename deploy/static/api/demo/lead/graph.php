<?php
// Microsoft Graph client for the Excel Table (client-credentials, app-only).
// Table columns must stay in the order of "columns" in lead-rules.json (do not reorder them in Excel).

function graph_configured($cfg) {
    foreach (array('tenant_id', 'client_id', 'client_secret', 'drive_id', 'item_id') as $k) if (empty($cfg[$k])) return false;
    return true;
}

function graph_base($cfg) { return rtrim(!empty($cfg['graph_base']) ? $cfg['graph_base'] : 'https://graph.microsoft.com/v1.0', '/'); }
function graph_login_base($cfg) { return rtrim(!empty($cfg['login_base']) ? $cfg['login_base'] : 'https://login.microsoftonline.com', '/'); }

// Token cached in data_dir until 2 minutes before expiry. Returns '' on failure (and sets $err).
function graph_token($cfg, &$err = '') {
    $cache = lead_data_dir($cfg) . '/graph-token.json';
    $c = is_file($cache) ? json_decode(file_get_contents($cache), true) : null;
    if (is_array($c) && !empty($c['token']) && $c['exp'] > time() + 120) return $c['token'];
    $r = http_request('POST', graph_login_base($cfg) . '/' . rawurlencode($cfg['tenant_id']) . '/oauth2/v2.0/token',
        array('Content-Type: application/x-www-form-urlencoded'),
        http_build_query(array('client_id' => $cfg['client_id'], 'client_secret' => $cfg['client_secret'],
            'scope' => 'https://graph.microsoft.com/.default', 'grant_type' => 'client_credentials')));
    if (!http_ok($r) || empty($r['json']['access_token'])) { $err = 'token: ' . http_err($r); return ''; }
    $exp = time() + (isset($r['json']['expires_in']) ? (int) $r['json']['expires_in'] : 3000);
    @file_put_contents($cache, json_encode(array('token' => $r['json']['access_token'], 'exp' => $exp)), LOCK_EX);
    return $r['json']['access_token'];
}

function graph_table_url($cfg) {
    $t = !empty($cfg['table_name']) ? $cfg['table_name'] : 'Leads';
    return graph_base($cfg) . '/drives/' . rawurlencode($cfg['drive_id']) . '/items/' . rawurlencode($cfg['item_id'])
        . '/workbook/tables/' . rawurlencode($t);
}

// One authenticated JSON call. Returns the http_request() result; status 0 and 'error' set when no token.
function graph_call($cfg, $method, $url, $data = null) {
    $err = '';
    $tok = graph_token($cfg, $err);
    if ($tok === '') return array('status' => 0, 'body' => '', 'json' => null, 'error' => $err);
    $r = http_json($method, $url, array('Authorization: Bearer ' . $tok), $data, 10);
    if ($r['status'] === 401) @unlink(lead_data_dir($cfg) . '/graph-token.json'); // stale token: refetch next call
    return $r;
}

// Assoc column=>value to ordered list for the table.
function graph_ordered($assoc, $columns) {
    $row = array();
    foreach ($columns as $c) $row[] = isset($assoc[$c]) ? $assoc[$c] : '';
    return $row;
}

// Returns array('ok' => bool, 'error' => string).
function graph_add_row($cfg, $rules, $assoc) {
    $r = graph_call($cfg, 'POST', graph_table_url($cfg) . '/rows/add', array('values' => array(graph_ordered($assoc, $rules['columns']))));
    return array('ok' => http_ok($r), 'error' => http_ok($r) ? '' : http_err($r));
}

// Lists all rows as array of array('index' => int, 'row' => assoc by column name). Returns null on failure.
function graph_list_rows($cfg, $rules, &$err = '') {
    $url = graph_table_url($cfg) . '/rows?$top=500';
    $rows = array();
    for ($page = 0; $url && $page < 40; $page++) {
        $r = graph_call($cfg, 'GET', $url);
        if (!http_ok($r) || !isset($r['json']['value'])) { $err = http_err($r); return null; }
        foreach ($r['json']['value'] as $item) {
            $vals = isset($item['values'][0]) ? $item['values'][0] : array();
            $assoc = array();
            foreach ($rules['columns'] as $i => $c) $assoc[$c] = isset($vals[$i]) ? $vals[$i] : '';
            $rows[] = array('index' => (int) $item['index'], 'row' => $assoc);
        }
        $url = isset($r['json']['@odata.nextLink']) ? $r['json']['@odata.nextLink'] : '';
    }
    return $rows;
}

// Writes only $changes (column => value) over the row's current values, so sales edits elsewhere are kept.
function graph_patch_row($cfg, $rules, $index, $current, $changes) {
    $r = graph_call($cfg, 'PATCH', graph_table_url($cfg) . '/rows/itemAt(index=' . (int) $index . ')',
        array('values' => array(graph_ordered(array_merge($current, $changes), $rules['columns']))));
    return array('ok' => http_ok($r), 'error' => http_ok($r) ? '' : http_err($r));
}

function graph_find_row($rows, $leadId) {
    foreach ($rows as $r) if ((string) $r['row']['Lead ID'] === $leadId) return $r;
    return null;
}

// Queue record -> assoc of sheet columns the website owns.
function sheet_row_from_record($rec, $rules) {
    $l = $rec['lead'];
    $utm = array();
    foreach ($l['utm'] as $k => $v) if ($v !== '') $utm[] = $k . '=' . $v;
    $where = trim($l['landing'] . (count($utm) ? ' | ' . implode('&', $utm) : '') . ($l['referrer'] !== '' ? ' | ref ' . $l['referrer'] : ''));
    return array(
        'Lead ID' => $rec['id'], 'Received' => $rec['receivedAt'], 'Name' => $l['name'], 'Company' => $l['company'],
        'Phone' => $l['phone'], 'Email' => $l['email'], 'Industry' => $l['industry'], 'City' => $l['city'],
        'Business size' => $l['businessSize'], 'Timeline' => $l['timeline'], 'Current software' => $l['currentSoftware'],
        'Message' => $l['message'], 'Landing page / UTM' => $where,
        'Marketing consent (timestamp)' => $l['marketingConsent'] ? ($l['consentText'] . ' ' . $l['consentAt']) : '',
        'Score' => $rec['score'], 'Priority' => $rec['priority'], 'Score reasons' => implode('; ', $rec['reasons']),
    );
}

// Columns the website refreshes on a repeat inquiry (never Owner, Contacted at, Outcome, Notes ...).
function sheet_repeat_columns() {
    return array('Phone', 'Email', 'Company', 'Industry', 'City', 'Business size', 'Timeline', 'Current software', 'Message',
        'Landing page / UTM', 'Marketing consent (timestamp)', 'Score', 'Priority', 'Score reasons');
}

// Delivers a queue record to the sheet: add, or on repeat/retry update the existing row. Returns array('ok','error').
function graph_deliver($cfg, $rules, $rec) {
    $assoc = sheet_row_from_record($rec, $rules);
    $attempts = isset($rec['delivery']['graph']['attempts']) ? $rec['delivery']['graph']['attempts'] : 0;
    $added = !empty($rec['delivery']['graph']['rowAdded']);
    if ($added || $attempts > 0) { // a previous add may have landed even if we saw a failure: look first
        $err = '';
        $rows = graph_list_rows($cfg, $rules, $err);
        if ($rows === null) return array('ok' => false, 'error' => 'list: ' . $err);
        $hit = graph_find_row($rows, $rec['id']);
        if ($hit) {
            $ch = array();
            foreach (sheet_repeat_columns() as $c) $ch[$c] = $assoc[$c];
            return graph_patch_row($cfg, $rules, $hit['index'], $hit['row'], $ch);
        }
    }
    return graph_add_row($cfg, $rules, $assoc);
}
