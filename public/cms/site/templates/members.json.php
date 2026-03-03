<?php

$membersPage = page('members');
$memberItems = [];

foreach ($membersPage->children()->listed() as $memberPage) {
    $photoFile = $memberPage->files()->template('member-photo')->first();

    $memberItems[] = [
        'id'         => $memberPage->slug(),
        'circleName' => $memberPage->circle_name()->value(),
        'realName'   => $memberPage->real_name()->value(),
        'role'       => $memberPage->role()->value(),
        'sigil'      => $memberPage->sigil()->value(),
        'color'      => $memberPage->color()->value(),
        'image'      => $photoFile ? $photoFile->url() : '',
    ];
}

echo Response::json($memberItems);
