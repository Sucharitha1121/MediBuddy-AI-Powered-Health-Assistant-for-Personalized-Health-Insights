import fitz  # PyMuPDF
from openai import OpenAI
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# More comprehensive CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",  # Vite default port
            "http://127.0.0.1:5173", 
            "http://localhost:3000",  # React default port
            "http://127.0.0.1:3000",
            "http://localhost:3001",  # Another possible port
            "*"  # Add this for broader compatibility (use cautiously)
        ],
        "methods": ["POST", "OPTIONS", "GET"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
}, supports_credentials=True)

# Set up Upstage AI API
client = OpenAI(
    api_key="up_8tWuuvkec1oN5SsGBEmJ5LMJ5skO5",
    base_url="https://api.upstage.ai/v1/solar"
)

# Ensure uploads directory exists
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using PyMuPDF."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
        return text.strip()
    except Exception as e:
        logger.error(f"PDF Text Extraction Error: {e}")
        return ""

def process_text_with_upstage(text):
    """Send extracted text to Upstage AI for structured data processing."""
    try:
        max_text_length = 10000
        truncated_text = text[:max_text_length]

        response = client.chat.completions.create(
            model="solar-pro",
            messages=[
                {
                    "role": "system", 
                    "content": "Extract key structured information from the medical document. Provide a clean JSON with extracted details."
                },
                {
                    "role": "user", 
                    "content": f"Extract structured data from this medical text:\n\n{truncated_text}"
                }
            ],
            stream=False
        )
        
        result = response.choices[0].message.content
        
        try:
            parsed_json = json.loads(result)
            return parsed_json
        except json.JSONDecodeError:
            return {"extracted_text": result}
    
    except Exception as e:
        logger.error(f"Upstage AI Processing Error: {e}")
        return {"error": str(e)}

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    """Handle PDF file upload, extract text, process using Upstage AI, and return JSON."""
    # Handle preflight OPTIONS requests
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    # Logging for debugging
    logger.debug(f"Received request: {request.method}")
    logger.debug(f"Request headers: {request.headers}")
    logger.debug(f"Request files: {request.files}")

    if 'file' not in request.files:
        logger.error("No file uploaded")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if not file or file.filename == '':
        logger.error("Invalid file")
        return jsonify({"error": "Invalid file. Please upload a valid PDF."}), 400

    if not file.filename.lower().endswith('.pdf'):
        logger.error("Invalid file type")
        return jsonify({"error": "Only PDF files are allowed"}), 400

    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        logger.debug(f"File saved to {file_path}")

        extracted_text = extract_text_from_pdf(file_path)
        
        if not extracted_text.strip():
            os.remove(file_path)
            logger.error("No text found in PDF")
            return jsonify({"error": "No text found in PDF"}), 400

        json_output = process_text_with_upstage(extracted_text)

        os.remove(file_path)

        response = make_response(jsonify({
            "success": True,
            "data": json_output,
            "extracted_text": extracted_text
        }))
        
        # Add comprehensive CORS headers
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        
        return response, 200

    except Exception as e:
        logger.error(f"Upload Processing Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)  # Changed port to 5001