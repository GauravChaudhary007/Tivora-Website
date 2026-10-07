<?php
// The one HTTP helper used by every integration. curl when available, else a stream context.
// Returns array('status' => int (0 = transport failure), 'body' => string, 'json' => mixed|null, 'error' => string).
function http_request($method, $url, $headers = array(), $body = null, $timeout = 8) {
    $res = array('status' => 0, 'body' => '', 'json' => null, 'error' => '');
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, array(
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => min($timeout, 5),
        ));
        if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        $raw = curl_exec($ch);
        if ($raw === false) $res['error'] = curl_error($ch);
        else { $res['body'] = $raw; $res['status'] = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE); }
        curl_close($ch);
    } else {
        $opts = array('method' => $method, 'header' => implode("\r\n", $headers), 'timeout' => $timeout, 'ignore_errors' => true);
        if ($body !== null) $opts['content'] = $body;
        $raw = @file_get_contents($url, false, stream_context_create(array('http' => $opts)));
        if ($raw === false) $res['error'] = 'request failed';
        else {
            $res['body'] = $raw;
            if (isset($http_response_header[0]) && preg_match('~\s(\d{3})\s~', $http_response_header[0], $m)) $res['status'] = (int) $m[1];
        }
    }
    if ($res['body'] !== '') $res['json'] = json_decode($res['body'], true);
    return $res;
}

// JSON request/response convenience over http_request().
function http_json($method, $url, $headers, $data = null, $timeout = 8) {
    $headers[] = 'Content-Type: application/json';
    $headers[] = 'Accept: application/json';
    return http_request($method, $url, $headers, $data === null ? null : json_encode($data), $timeout);
}

function http_ok($r) {
    return $r['status'] >= 200 && $r['status'] < 300;
}

function http_err($r) {
    return $r['status'] === 0 ? $r['error'] : ('HTTP ' . $r['status'] . ' ' . substr($r['body'], 0, 200));
}
