<?php

$lorePage  = page('lore');
$loreItems = [];

foreach ($lorePage->lore_entries()->toStructure() as $loreEntry) {
    $loreItems[] = [
        'id'               => (int) $loreEntry->entry_id()->value(),
        'text'             => $loreEntry->text()->value(),
        'hidden'           => $loreEntry->hidden()->toBool(),
        'revelationOrder'  => (int) $loreEntry->revelation_order()->value(),
    ];
}

echo Response::json($loreItems);
