<?php
// Teams "Workflows" webhook (Post to a channel when a webhook request is received) with an Adaptive Card.

function wa_link($phone, $rules, $text = '') {
    $p = phone_info($phone, $rules);
    if ($p['digits'] === '') return '';
    return 'https://wa.me/' . $p['digits'] . ($text !== '' ? '?text=' . rawurlencode($text) : '');
}

function teams_wrap($card) {
    return array('type' => 'message', 'attachments' => array(array(
        'contentType' => 'application/vnd.microsoft.card.adaptive', 'contentUrl' => null, 'content' => $card)));
}

function teams_card($rec, $cfg, $rules) {
    $l = $rec['lead'];
    $style = array('Hot' => 'attention', 'Warm' => 'warning', 'Cold' => 'accent');
    $facts = array();
    foreach (array('Phone' => $l['phone'], 'Email' => $l['email'], 'Company' => $l['company'], 'Industry' => $l['industry'], 'City' => $l['city'],
        'Timeline' => $l['timeline'], 'Business size' => $l['businessSize'], 'Current software' => $l['currentSoftware'],
        'Email updates' => $l['marketingConsent'] ? 'Yes' : 'No', 'WhatsApp updates + Channel' => !empty($l['whatsappConsent']) ? 'Yes' : 'No') as $k => $v) {
        if ($v !== '') $facts[] = array('title' => $k, 'value' => $v);
    }
    $title = $rec['priority'] . ' lead, score ' . $rec['score'] . ($rec['repeat'] > 0 ? ' (repeat inquiry ' . ($rec['repeat'] + 1) . ')' : '');
    $body = array(
        array('type' => 'Container', 'style' => isset($style[$rec['priority']]) ? $style[$rec['priority']] : 'default', 'items' => array(
            array('type' => 'TextBlock', 'text' => $title, 'weight' => 'Bolder', 'size' => 'Large', 'wrap' => true),
            array('type' => 'TextBlock', 'text' => $l['name'], 'wrap' => true),
        )),
        array('type' => 'FactSet', 'facts' => $facts),
    );
    if ($l['message'] !== '') $body[] = array('type' => 'TextBlock', 'text' => $l['message'], 'wrap' => true, 'isSubtle' => true);
    $body[] = array('type' => 'TextBlock', 'text' => 'Why: ' . implode(', ', $rec['reasons']), 'wrap' => true, 'size' => 'Small');
    $body[] = array('type' => 'TextBlock', 'text' => 'Follow up: ' . $rec['sla'], 'wrap' => true, 'weight' => 'Bolder');

    $actions = array();
    $ph = phone_info($l['phone'], $rules);
    if ($ph['e164'] !== '') {
        $actions[] = array('type' => 'Action.OpenUrl', 'title' => 'Call', 'url' => 'tel:' . $ph['e164']);
        $actions[] = array('type' => 'Action.OpenUrl', 'title' => 'WhatsApp', 'url' => wa_link($l['phone'], $rules));
    }
    if ($l['email'] !== '') $actions[] = array('type' => 'Action.OpenUrl', 'title' => 'Email', 'url' => 'mailto:' . $l['email']);
    if (!empty($cfg['sheet_url'])) $actions[] = array('type' => 'Action.OpenUrl', 'title' => 'Open sheet', 'url' => $cfg['sheet_url']);

    return array('type' => 'AdaptiveCard', '$schema' => 'http://adaptivecards.io/schemas/adaptive-card.json', 'version' => '1.4',
        'body' => $body, 'actions' => $actions);
}

function teams_post($cfg, $card) {
    $r = http_json('POST', $cfg['teams_webhook_url'], array(), teams_wrap($card), 10);
    return array('ok' => http_ok($r), 'error' => http_ok($r) ? '' : http_err($r));
}

function teams_deliver($cfg, $rules, $rec) {
    return teams_post($cfg, teams_card($rec, $cfg, $rules));
}
