<?php
// 获取网易云音乐外链地址

function netease_http($url) {
    $refer = "http://music.163.com/";
    $header[] = "Cookie: " . "appver=1.5.0.75771;";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($ch, CURLOPT_REFERER, $refer);
    $cexecute = curl_exec($ch);
    curl_close($ch);
    if ($cexecute) {
        $result = json_decode($cexecute, true);
        return $result;
    } else {
        return false;
    }
}

function netease_song($music_id) {
    $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
    $response = netease_http($url);
    if ($response["code"] == 200 && $response["songs"]) {
        //print_r($response["songs"]);
        return $response["songs"][0]["mp3Url"];
    }
    return false;
}

$id = $_REQUEST['id'];
$url = netease_song($id);
if ($url) {
    Header("Location: $url");
} else {
    echo 'Music No Found';
}
?>
