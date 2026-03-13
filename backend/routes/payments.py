from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.stripe_service import create_payment_intent
from backend.services.payment_service import get_payments

router = APIRouter()

class PaymentRequest(BaseModel):
    amount: int  # In cents

@router.post("/create-payment-intent")
async def create_intent(req: PaymentRequest):
    return create_payment_intent(req.amount)

@router.get("/")
async def list_payments():
    return get_payments()
