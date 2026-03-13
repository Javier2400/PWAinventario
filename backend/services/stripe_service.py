import stripe
import os

from app.services.payment_service import add_payment
from app.models.payment import PaymentRecord
from datetime import datetime

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_payment_intent(amount: int):
    try:
        # amount is in cents
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="mxn",
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        return {"error": str(e)}

async def handle_webhook_event(event):
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        print(f"PaymentIntent para {payment_intent['amount']} fue exitoso.")
        
        # Record payment
        new_payment = PaymentRecord(
            amount=payment_intent['amount'],
            currency=payment_intent['currency'],
            status="succeeded",
            created_at=datetime.now()
        )
        add_payment(new_payment)
        
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        error_message = payment_intent['last_payment_error']['message'] if payment_intent.get('last_payment_error') else "Unknown error"
        print(f"PaymentIntent falló: {error_message}")
    else:
        print(f"Evento no manejado: {event['type']}")
