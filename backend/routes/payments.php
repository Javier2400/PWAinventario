<?php
declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\StripeService;
use App\PaymentService;

global $app;

$app->post('/payments/create-payment-intent', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $amount = (int)($data['amount'] ?? 0);
    
    if ($amount <= 0) {
        $response->getBody()->write(json_encode(['error' => 'Invalid amount']));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }
    
    $result = StripeService::createPaymentIntent($amount);
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/payments', function (Request $request, Response $response) {
    $payments = PaymentService::getPayments();
    $response->getBody()->write(json_encode($payments));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/payments', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $payment = PaymentService::addPayment($data);
    $response->getBody()->write(json_encode($payment));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
});
