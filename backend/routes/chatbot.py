from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.chatbot_service import chatbot_response

router = APIRouter()

class Message(BaseModel):
    message: str

@router.post("/")
def chat(msg: Message):
    return chatbot_response(msg.message)