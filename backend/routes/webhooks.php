<?php
declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

global $app;

$app->post('/webhooks', function (Request $request, Response $response) {
    // Stripe webhook handler placeholder
    $payload = $request->getBody()->getContents();
    // Verify signature, handle events etc.
    
    $response->getBody()->write(json_encode(['status' => 'received']));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/webhooks/stripe', function (Request $request, Response $response) {
    // Stripe specific webhook
    $payload = $request->getBody()->getContents();
    $sig_header = $request->getHeaderLine('Stripe-Signature');
    
    // Add Stripe webhook verification logic here when needed
    
    $response->getBody()->write(json_encode(['status' => 'ok']));
    return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
});

