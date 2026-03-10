import os
import google.generativeai as genai

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def chatbot_response(message: str):
    try:
        response = model.generate_content(message)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Error al procesar el mensaje: {str(e)}"}
