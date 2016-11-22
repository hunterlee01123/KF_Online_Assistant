<?php
$id = $_GET['id'];
$quality = $_GET['quality'];
$content = file_get_contents('http://keepvid.com/?url=' . urlencode('https://www.youtube.com/watch?v=' . $id));
$url = '';
if ($quality != 'low' && preg_match('/<a href="([^"]+)"[^<>]+>[^<>]+<\/a>[^<>]+<b>(\(Max 720p\)|720p)<\/b>/i', $content, $matches)) {
    $url = $matches[1];
}
else if (preg_match('/<a href="([^"]+)"[^<>]+>[^<>]+<\/a>[^<>]+<b>(\(Max 480p\)|480p)<\/b>/i', $content, $matches)) {
    $url = $matches[1];
}
if ($url) Header("Location: $url");
else echo 'Video No Found';
?>