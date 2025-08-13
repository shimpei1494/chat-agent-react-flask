import json
import time

from flask import Blueprint, Response, jsonify, request
from pydantic import ValidationError

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


@chat_bp.route("/chat/ai-sdk", methods=["POST"])
def chat_ai_sdk():
    """Vercel AI SDK互換のエンドポイント"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Vercel AI SDK形式のメッセージを既存形式に変換
        messages = data.get("messages", [])
        if not messages:
            # 単一メッセージの場合
            message = data.get("message", "")
            if not message:
                return jsonify({"error": "No message provided"}), 400

            # ChatRequestに変換
            chat_request = ChatRequest(
                message=message,
                history=[],
                model=data.get("model", "gpt-4o-mini"),
                system_prompt=data.get(
                    "system_prompt", "You are a helpful AI assistant."
                ),
                temperature=data.get("temperature", 0.7),
            )
        else:
            # 複数メッセージの場合、最後のユーザーメッセージを抽出
            user_messages = [msg for msg in messages if msg.get("role") == "user"]
            if not user_messages:
                return jsonify({"error": "No user message found"}), 400

            last_message = user_messages[-1]["content"]
            # メッセージ履歴を変換
            history = []
            for msg in messages[:-1]:  # 最後のメッセージ以外を履歴として扱う
                if msg.get("role") in ["user", "assistant"]:
                    history.append(
                        {
                            "id": str(len(history)),
                            "content": msg["content"],
                            "role": msg["role"],
                            "timestamp": int(time.time() * 1000),
                        }
                    )

            chat_request = ChatRequest(
                message=last_message,
                history=history,
                model=data.get("model", "gpt-4o-mini"),
                system_prompt=data.get(
                    "system_prompt", "You are a helpful AI assistant."
                ),
                temperature=data.get("temperature", 0.7),
            )

        def generate_ai_sdk():
            """AI SDK形式のストリーミング"""
            try:
                for chunk in chat_service.process_chat_stream(chat_request):
                    if chunk.get("type") == "data":
                        # AI SDK形式に変換
                        ai_sdk_chunk = f'0:"{chunk["data"]}"\n'
                        yield ai_sdk_chunk

                # 完了を示すチャンク
                yield 'd:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n'
                yield 'e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n'

            except Exception as e:
                error_chunk = f'3:{{"error":"{str(e)}"}}\n'
                yield error_chunk

        return Response(
            generate_ai_sdk(),
            mimetype="text/plain",
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
