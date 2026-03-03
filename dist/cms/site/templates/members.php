<?php

$membersPage = page('members');
$memberItems = [];

foreach ($membersPage->children()->listed() as $memberPage) {
    $memberItems[] = [
        'id'         => $memberPage->slug(),
        'circleName' => $memberPage->circle_name()->value(),
        'realName'   => $memberPage->real_name()->value(),
        'role'       => $memberPage->role()->value(),
        'sigil'      => $memberPage->sigil()->value(),
        'color'      => $memberPage->color()->value(),
        'image'      => $memberPage->image_path()->value(),
    ];
}

echo Response::json($memberItems);
