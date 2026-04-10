<?php
declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

// Load environment variables
if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
}

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

$app = AppFactory::create();

// Body Parsing Middleware
$app->addBodyParsingMiddleware();

// Routing Middleware
$app->addRoutingMiddleware();

// Root
$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode(['message' => 'PHP API funcionando']));
    return $response->withHeader('Content-Type', 'application/json');
});

// Include routes
require_once __DIR__ . '/routes/products.php';
require_once __DIR__ . '/routes/payments.php';
require_once __DIR__ . '/routes/chatbot.php';
require_once __DIR__ . '/routes/webhooks.php';

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// CORS Middleware (Wraps all responses)
$app->add(function (Request $request, $handler) {
    $origin = $request->getHeaderLine('Origin');
    if (!$origin) {
        $origin = '*';
    }
    
    // Handle OPTIONS Preflight
    if ($request->getMethod() === 'OPTIONS') {
        $response = new \Slim\Psr7\Response();
        $response = $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
            ->withStatus(200);
            
        if ($origin !== '*') {
            $response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
        }
        
        return $response;
    }
    
    // Process the regular request
    $response = $handler->handle($request);
    
    // Attach CORS headers to the resulting response (including errors)
    $response = $response
        ->withHeader('Access-Control-Allow-Origin', $origin)
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        
    // Only add Allow-Credentials if not wildcard
    if ($origin !== '*') {
        $response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    return $response;
});

$app->run();

