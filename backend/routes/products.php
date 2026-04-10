<?php
declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\ProductService;

global $app;

$app->get('/products', function (Request $request, Response $response) {
    $products = ProductService::getProducts();
    $response->getBody()->write(json_encode($products));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/products', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $product = ProductService::addProduct($data);
    $response->getBody()->write(json_encode($product));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
});

$app->put('/products/{id}', function (Request $request, Response $response, array $args) {
    $id = (int)$args['id'];
    $data = $request->getParsedBody();
    $result = ProductService::updateProduct($id, $data);
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->delete('/products/{id}', function (Request $request, Response $response, array $args) {
    $result = ProductService::deleteProduct((int)$args['id']);
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});

