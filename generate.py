from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient

app = Flask(__name__)

# Initialize the Hugging Face API client
client = InferenceClient(
    api_key="hugging_face_token"
)

def generate_response(user_query, relevant_text, health_data):
    print("User Query:", user_query)
    print("Relevant Text:", relevant_text)
    print("Health Data:", health_data)
    
    prompt = f"""
You are MediBuddy, a helpful medical assistant chatbot. Answer the user's question based on their relevant medical data.

- Be clear, accurate, and concise.
- Use markdown for easy reading.
- Emphasize important points using *bold*.
- Provide actionable advice when applicable.

User's Medical Data: {health_data}
Relevant Context: {relevant_text}
User's Question: {user_query}

Your response:
"""

    try:
        # Call the model using Hugging Face API
        response = client.text_generation(
            model="mistralai/Mistral-7B-Instruct-v0.3",
            prompt=prompt,
            max_new_tokens=500,
            temperature=0.7
        )
        return response
    except Exception as e:
        return str(e)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        user_query = data.get('user_query')
        relevant_text = data.get('relevant_text')
        health_data = data.get('health_data')

        if not user_query or not relevant_text or not health_data:
            return jsonify({"error": "Missing required fields"}), 400

        response_text = generate_response(user_query, relevant_text, health_data)
        return jsonify({"generated_text": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
