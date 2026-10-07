<?php
// Assert-based tests for lead scoring, phone handling and dedupe.
//   tools/php/php.exe -c tools/php.ini tests/lead/score_test.php
$root = dirname(__FILE__) . '/../../';
require $root . 'deploy/static/api/demo/lead/score.php';
require $root . 'deploy/static/api/demo/lead/queue.php';
$rules = lead_load_rules($root . 'config/lead-rules.json');

$pass = 0;
function check($cond, $label) {
    global $pass;
    if (!$cond) { fwrite(STDERR, "FAIL: $label\n"); exit(1); }
    $pass++;
}
function mk($o = array()) {
    return array_merge(array('name' => 'Ram Shrestha', 'company' => '', 'phone' => '', 'email' => '', 'industry' => '', 'city' => '', 'message' => '',
        'timeline' => '', 'businessSize' => '', 'currentSoftware' => ''), $o);
}

// Hot: every strong signal
$hot = score_lead(mk(array('phone' => '9812345678', 'email' => 'ram@acmejewels.com.np', 'industry' => 'Jewellery', 'city' => 'Kathmandu',
    'message' => 'We need a demo and price for 3 branches, urgent', 'timeline' => '1m', 'businessSize' => 'large', 'currentSoftware' => 'excel')), $rules);
check(!$hot['spam'] && $hot['score'] === 100 && $hot['priority'] === 'Hot', 'hot lead scores 100 / Hot, got ' . $hot['score']);
check(count($hot['reasons']) === 7 && strpos($hot['sla'], '15 minutes') !== false, 'hot has 7 reasons and the 15 minute SLA');

// Warm
$warm = score_lead(mk(array('phone' => '9801234567', 'email' => 'ram@gmail.com', 'industry' => 'FMCG', 'timeline' => '1-3m', 'businessSize' => 'medium', 'currentSoftware' => 'other-erp')), $rules);
check($warm['score'] === 63 && $warm['priority'] === 'Warm', 'warm lead is 63 / Warm, got ' . $warm['score']);

// Cold: nothing but a free email
$cold = score_lead(mk(array('email' => 'sita@gmail.com')), $rules);
check($cold['score'] === 25 && $cold['priority'] === 'Cold', 'cold lead is 25 / Cold, got ' . $cold['score']);

// Band edges
check(lead_band(70, $rules)['priority'] === 'Hot' && lead_band(69, $rules)['priority'] === 'Warm', 'hot starts at 70');
check(lead_band(40, $rules)['priority'] === 'Warm' && lead_band(39, $rules)['priority'] === 'Cold', 'warm starts at 40');

// Free vs business email (same lead, only the email changes): +5
$free = score_lead(mk(array('email' => 'a@gmail.com')), $rules);
$biz = score_lead(mk(array('email' => 'a@acme.com.np')), $rules);
check($biz['score'] - $free['score'] === 5, 'business email is worth 5 more than a free one');

// Spam is dropped, not scored
foreach (array(
    mk(array('name' => 'aaaa', 'phone' => '9812345678')), mk(array('name' => 'test', 'phone' => '9812345678')),
    mk(array('email' => 'x@mailinator.com')), mk(array('email' => 'test@acme.com')),
    mk(array('message' => 'see http://a.com http://b.com http://c.com')), mk(array('message' => 'cheap viagra')),
) as $i => $s) {
    $r = score_lead($s, $rules);
    check($r['spam'] === true && $r['priority'] === 'Spam' && $r['score'] === 0, "spam fixture $i is dropped");
}
check(!score_lead(mk(array('name' => 'Ram', 'message' => 'one link http://a.com')), $rules)['spam'], 'one link is not spam');

// Nepal phone variants all normalise to +9779812345678
foreach (array('9812345678', '+977 9812345678', '977-9812345678', '09812345678', '(+977) 98123 45678', '+9779812345678') as $p) {
    $i = phone_info($p, $rules);
    check($i['mobile'] && $i['e164'] === '+9779812345678' && $i['digits'] === '9779812345678', "phone variant $p");
}
check(!phone_info('9612345678', $rules)['mobile'], '96 prefix is not a Nepal mobile');
check(!phone_info('981234567', $rules)['mobile'], '9 digits is not a Nepal mobile');
check(phone_info('01-5389641', $rules)['nepal'] && !phone_info('01-5389641', $rules)['mobile'], 'Kathmandu landline is Nepal but not mobile');
$intl = phone_info('+44 7700 900123', $rules);
check(!$intl['nepal'] && $intl['e164'] === '+447700900123', 'international number kept as is');
check(wa_link_digits(), 'wa digits');
function wa_link_digits() { global $rules; return phone_info('9812345678', $rules)['digits'] === '9779812345678'; }

// Location: outside Nepal scores 1, inside 5
$in = score_lead(mk(array('email' => 'a@gmail.com', 'city' => 'Pokhara')), $rules);
check($in['score'] - $free['score'] === 4, 'Nepal city adds 4 over unknown location');

// Duplicate detection: same phone in another format, or same email, inside 7 days
$old = array('id' => 'L1', 'receivedAt' => gmdate('c', time() - 2 * 86400), 'lead' => mk(array('phone' => '+977 9812345678', 'email' => 'a@acme.com')));
check(q_find_dup(array($old), mk(array('phone' => '09812345678')), $rules, 7) === 'L1', 'dup by phone in another format');
check(q_find_dup(array($old), mk(array('email' => 'A@ACME.com')), $rules, 7) === 'L1', 'dup by email, case-insensitive');
check(q_find_dup(array($old), mk(array('phone' => '9801111111', 'email' => 'b@acme.com')), $rules, 7) === '', 'different person is not a dup');
$old['receivedAt'] = gmdate('c', time() - 8 * 86400);
check(q_find_dup(array($old), mk(array('phone' => '9812345678')), $rules, 7) === '', 'older than 7 days is not a dup');

echo "score_test: $pass assertions passed\n";
