<?php
// Pure lead scoring. No I/O except lead_load_rules(). Weights live in lead-rules.json.
function lead_load_rules($file) {
    $r = is_file($file) ? json_decode(file_get_contents($file), true) : null;
    return is_array($r) ? $r : array();
}

// Returns array('e164' => '+9779812345678'|'', 'digits' => '9779812345678', 'nepal' => bool, 'mobile' => bool)
function phone_info($phone, $rules) {
    $raw = preg_replace('/[\s().-]+/', '', (string) $phone);
    $out = array('e164' => '', 'digits' => '', 'nepal' => false, 'mobile' => false);
    if ($raw === '') return $out;
    if (preg_match('~' . $rules['nepalMobileRegex'] . '~', $raw, $m)) {
        $out['mobile'] = $out['nepal'] = true;
        $out['digits'] = '977' . $m[1];
    } elseif (preg_match('~' . $rules['nepalLandlineRegex'] . '~', $raw, $m)) {
        $out['nepal'] = true;
        $out['digits'] = '977' . $m[1];
    } else {
        $out['digits'] = preg_replace('/\D+/', '', $raw);
    }
    if ($out['digits'] !== '') $out['e164'] = '+' . $out['digits'];
    return $out;
}

function email_domain($email) {
    $p = strrpos((string) $email, '@');
    return $p === false ? '' : strtolower(substr($email, $p + 1));
}

function lead_is_spam($lead, $rules) {
    $s = $rules['spam'];
    $name = strtolower(trim($lead['name']));
    foreach ($s['junkNamePatterns'] as $p) if (preg_match('~' . $p . '~i', $name)) return 'junk name';
    if ($lead['email'] !== '') {
        if (in_array(email_domain($lead['email']), $s['testEmailDomains'], true)) return 'test email';
        $local = strtolower(substr($lead['email'], 0, strrpos($lead['email'], '@')));
        if (in_array($local, $s['testEmailLocalParts'], true)) return 'test email';
    }
    $msg = strtolower($lead['message']);
    if (preg_match_all('~https?://|www\.~i', $msg) > $s['maxLinksInMessage']) return 'link spam';
    foreach ($s['messageBadWords'] as $w) if ($msg !== '' && strpos($msg, $w) !== false) return 'spam words';
    return '';
}

// $lead keys: name, phone, email, industry, city, message, timeline, businessSize, currentSoftware.
// Returns array('spam' => bool, 'spamReason', 'score' => 0..100, 'priority' => Hot|Warm|Cold|Spam, 'sla', 'reasons' => []).
function score_lead($lead, $rules) {
    $w = $rules['weights'];
    $why = lead_is_spam($lead, $rules);
    if ($why !== '') return array('spam' => true, 'spamReason' => $why, 'score' => 0, 'priority' => 'Spam', 'sla' => '', 'reasons' => array('Spam: ' . $why));

    $reasons = array();
    $total = 0;
    $add = function ($pts, $label) use (&$total, &$reasons) { $total += $pts; $reasons[] = $label . ' +' . $pts; };
    $pick = function ($map, $key) { return isset($map[$key]) ? $map[$key] : (isset($map['']) ? $map[''] : 0); };

    $tl = isset($lead['timeline']) ? $lead['timeline'] : '';
    $sz = isset($lead['businessSize']) ? $lead['businessSize'] : '';
    $sw = isset($lead['currentSoftware']) ? $lead['currentSoftware'] : '';
    $ind = isset($w['industry'][$lead['industry']]) ? $lead['industry'] : ($lead['industry'] === '' ? '' : 'Other');

    $add($pick($w['timeline'], $tl), 'Timeline ' . ($tl === '' ? 'not given' : $tl));
    $add($pick($w['size'], $sz), 'Size ' . ($sz === '' ? 'not given' : $sz));
    $add($pick($w['industry'], $ind), 'Industry ' . ($lead['industry'] === '' ? 'not given' : $lead['industry']));

    $ph = phone_info($lead['phone'], $rules);
    $bizMail = $lead['email'] !== '' && !in_array(email_domain($lead['email']), $rules['freeEmailDomains'], true);
    $contact = 0;
    if ($ph['mobile']) $contact += $w['contact']['nepalMobile'];
    if ($bizMail) $contact += $w['contact']['businessEmail'];
    if ($lead['phone'] !== '' && $lead['email'] !== '') $contact += $w['contact']['both'];
    $add($contact, 'Contact quality (' . ($ph['mobile'] ? 'Nepal mobile' : ($lead['phone'] !== '' ? 'other phone' : 'no phone')) . ', ' . ($lead['email'] === '' ? 'no email' : ($bizMail ? 'business email' : 'free email')) . ')');

    $add($pick($w['software'], $sw), 'Software ' . ($sw === '' ? 'not given' : $sw));

    $hits = 0;
    foreach ($rules['keywords'] as $k) if (preg_match('~\b' . $k . '~i', $lead['message'])) $hits++;
    $m = min($w['message']['keywordMax'], $hits * $w['message']['perKeyword']);
    if (strlen($lead['message']) > $w['message']['longChars']) $m += $w['message']['long'];
    $add($m, 'Message intent');

    $nepal = $ph['nepal'] || in_array(strtolower($lead['city']), $rules['nepalCities'], true);
    $add($nepal ? $w['location']['nepal'] : $w['location']['other'], $nepal ? 'In Nepal' : 'Location unknown or outside Nepal');

    $total = max(0, min(100, $total));
    return array('spam' => false, 'spamReason' => '', 'score' => $total) + lead_band($total, $rules) + array('reasons' => $reasons);
}

function lead_band($score, $rules) {
    $b = $rules['bands'];
    $k = $score >= $b['hot']['min'] ? 'hot' : ($score >= $b['warm']['min'] ? 'warm' : 'cold');
    return array('priority' => $b[$k]['label'], 'sla' => $b[$k]['sla']);
}
