from typing import List
from models.payment import PaymentRecord

payments_db: List[PaymentRecord] = []

def get_payments():
    return payments_db

def add_payment(payment: PaymentRecord):
    payment.id = len(payments_db) + 1
    payments_db.append(payment)
    return payment
