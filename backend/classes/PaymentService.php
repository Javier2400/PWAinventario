<?php
declare(strict_types=1);

namespace App;

class PaymentService {
    private static string $file = __DIR__ . '/../data/payments.json';

    private static function load(): array {
        if (!file_exists(self::$file)) {
            return [];
        }
        $content = file_get_contents(self::$file);
        return json_decode($content, true) ?: [];
    }

    private static function save(array $payments): void {
        file_put_contents(self::$file, json_encode($payments, JSON_PRETTY_PRINT));
    }

    public static function getPayments(): array {
        return self::load();
    }

    public static function addPayment(array $payment): array {
        $payments = self::load();
        $payment['id'] = $payment['id'] ?? time();
        $payment['created_at'] = $payment['created_at'] ?? date('c');
        $payments[] = $payment;
        self::save($payments);
        return $payment;
    }
}
