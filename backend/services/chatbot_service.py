import os
from openai import OpenAI

# ChatAnywhere GPT API (OpenAI compatible)
client = OpenAI(
    base_url="https://api.chatanywhere.com/v1",
    api_key=os.getenv("CHATANYWHERE_API_KEY", "sk-1eXRHaJcEYswkoaByTzNH6s0yRnVuYHU6z2BI6xCtRhkpvUD")
)

def chatbot_response(message: str):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": message}]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        return {"response": f"Error al procesar el mensaje: {str(e)}"}
