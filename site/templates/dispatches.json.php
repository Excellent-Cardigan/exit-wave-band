<?php

$dispatchesPage = page('dispatches');
$items = [];

foreach ($dispatchesPage->children()->listed()->sortBy('date', 'desc') as $post) {
    $coverFile = $post->files()->template('cover')->first();

    $items[] = [
        'id'         => $post->slug(),
        'title'      => $post->title()->value(),
        'date'       => $post->date()->toDate('Y-m-d'),
        'author'     => $post->author()->or('exit.wave')->value(),
        'body'       => $post->body()->kirbytext()->value(),
        'coverImage' => $coverFile ? $coverFile->url() : '',
    ];
}

echo Response::json($items);
