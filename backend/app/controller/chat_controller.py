from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.types.chat_types import ChatRequest, ChatResponse
from app.service.chat_service import ChatService

chat_bp = Blueprint("chat", __name__)
chat_service = ChatService()


@chat_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        chat_request = ChatRequest(**data)
        response = chat_service.process_chat(chat_request)
        
        return jsonify(response.model_dump())
    
    except ValidationError as e:
        return jsonify({"error": "Invalid request data", "details": e.errors()}), 400
    
    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@chat_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200