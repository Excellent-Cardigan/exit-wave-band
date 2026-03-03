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

    // Custom routes
    'routes' => [
        [
            'pattern' => 'contact',
            'method'  => 'POST',
            'action'  => function () {
                $kirby = kirby();
                $body  = json_decode($kirby->request()->body()->contents(), true);

                $senderName    = trim($body['name'] ?? '');
                $senderEmail   = trim($body['email'] ?? '');
                $messageText   = trim($body['message'] ?? '');

                // Basic validation
                if (!$senderName || !$senderEmail || !$messageText) {
                    return Response::json(['ok' => false, 'error' => 'All fields are required.'], 400);
                }
                if (!filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
                    return Response::json(['ok' => false, 'error' => 'Invalid email address.'], 400);
                }

                // Session-based rate limiting: 1 submission per 60 seconds
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
                            'senderName'    => $senderName,
                            'senderEmail'   => $senderEmail,
                            'messageText'   => $messageText,
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
