<?php

return [
    // Panel install — set to true ONLY for the first deploy to create admin account
    'panel' => [
        'install' => false,
    ],

    // Email via PHP mail() — cPanel shared hosting
    'email' => [
        'transport' => [
            'type' => 'mail',
        ],
    ],

    'routes' => [

        // ── JSON API endpoints ────────────────────────────────────────────────
        // Kirby's content representation routing (.json extension) requires a
        // base template alongside the .json.php template. Using explicit routes
        // is more reliable and bypasses that requirement.

        [
            'pattern' => 'tracks.json',
            'action'  => function () {
                $trackItems = [];
                foreach (page('tracks')->children()->listed() as $trackPage) {
                    $audioFile    = $trackPage->files()->template('audio')->first();
                    $coverFile    = $trackPage->files()->template('cover')->first();
                    $trackItems[] = [
                        'id'       => $trackPage->slug(),
                        'title'    => $trackPage->title()->value(),
                        'album'    => $trackPage->album()->value(),
                        'duration' => $trackPage->duration()->value(),
                        'audioSrc' => $audioFile ? $audioFile->url() : '',
                        'image'    => $coverFile ? $coverFile->url() : '',
                        'status'   => $trackPage->track_status()->value(),
                        'bpm'      => (int) $trackPage->bpm()->value(),
                        'stems'    => $trackPage->stems()->toBool(),
                        'featured' => $trackPage->featured()->toBool(),
                    ];
                }
                return Response::json($trackItems);
            },
        ],

        [
            'pattern' => 'albums.json',
            'action'  => function () {
                $albumItems = [];
                foreach (page('albums')->children()->listed() as $albumPage) {
                    $coverFile    = $albumPage->files()->template('cover')->first();
                    $trackPages   = $albumPage->tracks()->toPages();
                    $trackSlugs   = [];
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
                return Response::json($albumItems);
            },
        ],

        [
            'pattern' => 'members.json',
            'action'  => function () {
                $memberItems = [];
                foreach (page('members')->children()->listed() as $memberPage) {
                    $photoFile     = $memberPage->files()->template('member-photo')->first();
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
                return Response::json($memberItems);
            },
        ],

        [
            'pattern' => 'lore.json',
            'action'  => function () {
                $loreItems = [];
                foreach (page('lore')->lore_entries()->toStructure() as $loreEntry) {
                    $loreItems[] = [
                        'id'              => (int) $loreEntry->entry_id()->value(),
                        'text'            => $loreEntry->text()->value(),
                        'hidden'          => $loreEntry->hidden()->toBool(),
                        'revelationOrder' => (int) $loreEntry->revelation_order()->value(),
                    ];
                }
                return Response::json($loreItems);
            },
        ],

        [
            'pattern' => 'dispatches.json',
            'action'  => function () {
                $items = [];
                foreach (page('dispatches')->children()->listed()->sortBy('date', 'desc') as $post) {
                    $coverFile = $post->files()->template('cover')->first();
                    $items[]   = [
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
                return Response::json($items);
            },
        ],

        // ── Contact form ──────────────────────────────────────────────────────

        [
            'pattern' => 'contact',
            'method'  => 'POST',
            'action'  => function () {
                $kirby = kirby();
                $body  = json_decode($kirby->request()->body()->contents(), true);

                $senderName  = trim($body['name'] ?? '');
                $senderEmail = trim($body['email'] ?? '');
                $messageText = trim($body['message'] ?? '');

                if (!$senderName || !$senderEmail || !$messageText) {
                    return Response::json(['ok' => false, 'error' => 'All fields are required.'], 400);
                }
                if (!filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
                    return Response::json(['ok' => false, 'error' => 'Invalid email address.'], 400);
                }

                $session        = $kirby->session();
                $lastSubmission = $session->get('contact.last_submission', 0);
                if (time() - $lastSubmission < 60) {
                    return Response::json(['ok' => false, 'error' => 'Please wait before sending another message.'], 429);
                }

                try {
                    $kirby->email([
                        'template' => 'contact',
                        'from'     => 'noreply@exitwave.band',
                        'replyTo'  => $senderEmail,
                        'to'       => 'contact@exitwave.band',
                        'subject'  => 'New Transmission from ' . $senderName,
                        'data'     => [
                            'senderName'  => $senderName,
                            'senderEmail' => $senderEmail,
                            'messageText' => $messageText,
                        ],
                    ]);

                    $session->set('contact.last_submission', time());
                    return Response::json(['ok' => true]);
                } catch (Exception $emailException) {
                    return Response::json(['ok' => false, 'error' => 'Transmission failed. Try again.'], 500);
                }
            },
        ],
    ],
];
