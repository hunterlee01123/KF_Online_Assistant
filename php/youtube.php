<?php
$id = $_GET['id'];
$quality = $_GET['quality'];
$content = file_get_contents('http://keepvid.com/?url=' . urlencode('https://www.youtube.com/watch?v=' . $id));
$url = '';
if ($quality != 'low' && preg_match('/\(Max 720p\)<\/td>(?:.|\r|\n)+?<td><a href="([^"]+)"/i', $content, $matches)) {
    $url = $matches[1];
}
else if (preg_match('/480p<\/td>(?:.|\r|\n)+?<td><a href="([^"]+)"/i', $content, $matches)) {
    $url = $matches[1];
}
if ($url) Header('Location: ' . str_replace('http://', 'https://', $url));
else echo 'Video No Found';
?>