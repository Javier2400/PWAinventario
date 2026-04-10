<?php
declare(strict_types=1);

namespace App;

use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripeService {
    public static function createPaymentIntent(int $amount): array {
        $stripe_key = $_ENV['STRIPE_SECRET_KEY'] ?? $_SERVER['STRIPE_SECRET_KEY'] ?? getenv('STRIPE_SECRET_KEY');
        Stripe::setApiKey($stripe_key);
        
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'mxn',
            ]);
            return [
                'client_secret' => $paymentIntent->client_secret
            ];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}

