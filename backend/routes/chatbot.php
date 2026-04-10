<?php
declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\ChatbotService;

global $app;

$app->post('/chatbot', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $message = $data['message'] ?? '';
    
    if (empty($message)) {
        $response->getBody()->write(json_encode(['error' => 'Message required']));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }
    
    $result = ChatbotService::sendMessage($message);
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});

