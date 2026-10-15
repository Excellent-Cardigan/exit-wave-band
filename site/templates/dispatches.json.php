<?php

$dispatchesPage = page('dispatches');
$items = [];

foreach ($dispatchesPage->children()->listed()->sortBy('date', 'desc') as $post) {
    $coverFile = $post->files()->template('cover')->first();

    $items[] = [
        'id'             => $post->slug(),
        'slug'           => $post->slug(),
        'title'          => $post->title()->value(),
        'date'           => $post->date()->toDate('Y-m-d'),
        'transmissionId' => $post->transmission_id()->value(),
        'excerpt'        => $post->excerpt()->value(),
        'body'           => $post->body()->value(),
        'author'         => $post->author()->or('exit.wave')->value(),
        'coverImage'     => $coverFile ? $coverFile->url() : '',
    ];
}

echo Response::json($items);
