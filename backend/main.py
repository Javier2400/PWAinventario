from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from app.routes import products


app = FastAPI()

app.include_router(products.router, prefix="/products", tags=["Products"])

@app.get("/")
def read_root():
    return {"message": "API funcionando"}

from app.routes import payments, webhooks
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])

from app.routes import chatbot
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)