<?php

$tracksPage = page('tracks');
$trackItems = [];

foreach ($tracksPage->children()->listed() as $trackPage) {
    $trackItems[] = [
        'id'       => $trackPage->slug(),
        'title'    => $trackPage->title()->value(),
        'album'    => $trackPage->album()->value(),
        'duration' => $trackPage->duration()->value(),
        'audioSrc' => $trackPage->audio_src()->value(),
        'image'    => $trackPage->image_url()->value(),
        // Kirby reserves "status" internally — stored as track_status, exposed as status
        'status'   => $trackPage->track_status()->value(),
        'bpm'      => (int) $trackPage->bpm()->value(),
        'stems'    => $trackPage->stems()->toBool(),
        'featured' => $trackPage->featured()->toBool(),
    ];
}

echo Response::json($trackItems);
