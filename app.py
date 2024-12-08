from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])


def enhance_response(response_text):
    
    response_text = response_text.strip()
    response_text = response_text.replace("important", "**important** 🔑")
    response_text = response_text.replace("note", "**note** 📝")
    response_text = response_text.replace("help", "**help** 🛠️")
    response_text += " 😊"
    return response_text


def get_gemini_response(question):
    response = chat.send_message(question, stream=True)
    full_response = "".join(chunk.text for chunk in response)
    return enhance_response(full_response)


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat_response():
    user_message = request.json.get("message")
    if user_message:
        bot_response = get_gemini_response(user_message)
        return jsonify({"bot_message": bot_response})
    return jsonify({"error": "No message received"}), 400


if __name__ == "__main__":
    app.run(debug=True)
