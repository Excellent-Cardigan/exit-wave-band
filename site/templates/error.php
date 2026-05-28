<?php
http_response_code(200);
$indexFile = kirby()->root() . '/index.html';
if (file_exists($indexFile)) {
    readfile($indexFile);
}
