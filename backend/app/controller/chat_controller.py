from flask import Blueprint, jsonify, request, Response, stream_template
from pydantic import ValidationError
import json

from app.service.chat_service import ChatService
from app.types.chat_types import ChatRequest

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


@chat_bp.route("/chat/stream", methods=["POST"])
def chat_stream():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        chat_request = ChatRequest(**data)

        def generate():
            try:
                for chunk in chat_service.process_chat_stream(chat_request):
                    yield f"data: {json.dumps(chunk)}\n\n"
                yield 'data: {"type": "complete"}\n\n'
            except Exception as e:
                error_chunk = {"type": "error", "error": str(e)}
                yield f"data: {json.dumps(error_chunk)}\n\n"

        return Response(
            generate(),
            mimetype="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        )

    except ValidationError as e:
        return jsonify({"error": "Invalid request data", "details": e.errors()}), 400

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@chat_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200
