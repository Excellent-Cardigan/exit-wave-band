<?php

$albumsPage = page('albums');
$albumItems = [];

foreach ($albumsPage->children()->listed() as $albumPage) {
    $coverFile  = $albumPage->files()->template('cover')->first();
    $trackPages = $albumPage->tracks()->toPages();

    $trackSlugs = [];
    foreach ($trackPages as $trackPage) {
        $trackSlugs[] = $trackPage->slug();
    }

    $albumItems[] = [
        'id'         => $albumPage->slug(),
        'title'      => $albumPage->title()->value(),
        'year'       => (int) $albumPage->year()->value(),
        'artist'     => $albumPage->artist()->or('exit.wave')->value(),
        'coverImage' => $coverFile ? $coverFile->url() : '',
        'trackSlugs' => $trackSlugs,
    ];
}

echo Response::json($albumItems);
