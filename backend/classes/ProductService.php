<?php
declare(strict_types=1);

namespace App;

class ProductService {
    private static string $file = __DIR__ . '/../data/products.json';

    private static function load(): array {
        if (!file_exists(self::$file)) {
            return [];
        }
        $content = file_get_contents(self::$file);
        return json_decode($content, true) ?: [];
    }

    private static function save(array $products): void {
        file_put_contents(self::$file, json_encode($products, JSON_PRETTY_PRINT));
    }

    public static function getProducts(): array {
        return self::load();
    }

    public static function addProduct(array $product): array {
        $products = self::load();
        $product['id'] = time();
        $products[] = $product;
        self::save($products);
        return $product;
    }

    public static function updateProduct(int $id, array $data): array {
        $products = self::load();
        foreach ($products as &$product) {
            if ($product['id'] === $id) {
                $product = array_merge($product, $data);
                self::save($products);
                return $product;
            }
        }
        return ['error' => 'Producto no encontrado'];
    }

    public static function deleteProduct(int $id): array {
        $products = self::load();
        $newProducts = array_filter($products, fn($p) => $p['id'] !== $id);
        if (count($products) !== count($newProducts)) {
            self::save(array_values($newProducts));
            return ['message' => 'Producto eliminado'];
        }
        return ['error' => 'Producto no encontrado'];
    }
}
