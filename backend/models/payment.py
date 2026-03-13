from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PaymentRecord(BaseModel):
    id: Optional[int] = None
    amount: int
    currency: str
    status: str
    created_at: datetime = Field(default_factory=datetime.now)
