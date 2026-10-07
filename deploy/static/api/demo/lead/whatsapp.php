<?php
// Daily "WhatsApp to send" list: consenting leads with an Outcome whose cadence is due.
// Sending stays manual (tap the wa.me link, press send from the Business number); the tick in the sheet stamps the date.

function np_today() {
    $d = new DateTime('now', new DateTimeZone('Asia/Kathmandu'));
    return $d->format('Y-m-d');
}

function sheet_truthy($v) {
    if ($v === true) return true;
    return in_array(strtolower(trim((string) $v)), array('true', 'yes', 'y', 'x', '1', 'done', "\xE2\x9C\x93", "\xE2\x9C\x94"), true);
}

function fill_template($t, $name, $company) {
    $first = preg_split('/\s+/', trim($name));
    return str_replace(array('{name}', '{company}'), array($first[0], $company !== '' ? $company : 'your business'), $t);
}

function sheet_cell_date($v) {
    $s = trim((string) $v);
    if ($s === '') return '';
    if (is_numeric($s) && $s > 30000 && $s < 90000) return gmdate('Y-m-d', (int) (($s - 25569) * 86400)); // Excel serial date
    $t = strtotime($s);
    return $t === false ? '' : gmdate('Y-m-d', $t);
}

// $rows from graph_list_rows(). Returns list of array('index','row','link','due' => days overdue) sorted most overdue first.
function whatsapp_due($rows, $rules, $today) {
    $out = array();
    foreach ($rows as $r) {
        $row = $r['row'];
        $oc = isset($row['Outcome']) ? trim($row['Outcome']) : '';
        if (!isset($rules['cadenceDays']['whatsapp'][$oc])) continue;
        if (trim((string) $row['Marketing consent (timestamp)']) === '' || sheet_truthy($row['Unsubscribed'])) continue;
        if (sheet_truthy($row['WhatsApp done'])) continue; // tick not yet processed: treat as sent
        $p = phone_info($row['Phone'], $rules);
        if (!$p['mobile']) continue;
        $last = sheet_cell_date($row['Last WhatsApp sent']);
        $age = $last === '' ? 9999 : (int) ((strtotime($today) - strtotime($last)) / 86400);
        $days = $rules['cadenceDays']['whatsapp'][$oc];
        if ($age < $days) continue;
        $text = fill_template($rules['templates']['whatsapp'][$oc], $row['Name'], $row['Company']);
        $out[] = array('index' => $r['index'], 'row' => $row, 'link' => wa_link($row['Phone'], $rules, $text), 'overdue' => $age - $days);
    }
    usort($out, function ($a, $b) { return $b['overdue'] - $a['overdue']; });
    return $out;
}

// One Teams post, at most whatsappListMax lines.
function whatsapp_card($due, $rules) {
    $max = $rules['whatsappListMax'];
    $lines = array();
    foreach (array_slice($due, 0, $max) as $d) {
        $r = $d['row'];
        $lines[] = '- ' . $r['Name'] . ($r['Company'] !== '' ? ' (' . $r['Company'] . ')' : '') . ', ' . $r['Outcome'] . ': [Send](' . $d['link'] . ')';
    }
    if (count($due) > $max) $lines[] = '- and ' . (count($due) - $max) . ' more, see the sheet';
    return array('type' => 'AdaptiveCard', '$schema' => 'http://adaptivecards.io/schemas/adaptive-card.json', 'version' => '1.4', 'body' => array(
        array('type' => 'TextBlock', 'text' => 'WhatsApp to send today: ' . count($due), 'weight' => 'Bolder', 'size' => 'Large', 'wrap' => true),
        array('type' => 'TextBlock', 'text' => "Tap Send, press send in WhatsApp, then tick WhatsApp done in the sheet.\n\n" . implode("\n", $lines), 'wrap' => true),
    ));
}
