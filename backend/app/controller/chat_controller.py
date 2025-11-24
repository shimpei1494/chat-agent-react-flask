import time
from typing import Any

from flask import Blueprint, Response, jsonify, request
from pydantic import ValidationError

from app.service.chat_service import ChatService
from app.types.chat_types import ChatRequest

chat_bp = Blueprint("chat", __name__)
chat_service = ChatService()


@chat_bp.route("/chat", methods=["POST"])
def chat():
    """AI SDK標準エンドポイント /api/chat"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # AI SDK形式: { messages: [UIMessage] } を処理
        messages = data.get("messages", [])
        if not messages:
            return jsonify({"error": "No messages provided"}), 400

        # 最後のユーザーメッセージを取得
        user_messages = [msg for msg in messages if msg.get("role") == "user"]
        if not user_messages:
            return jsonify({"error": "No user message found"}), 400

        # 最新のユーザーメッセージから内容を抽出
        last_user_msg = user_messages[-1]
        message_content = last_user_msg.get("content", "")

        # メッセージ履歴を構築
        history = build_message_history(messages[:-1])

        # 設定値（将来的にはリクエストから取得）
        model = data.get("model", "gpt-4o-mini")
        system_prompt = data.get("system_prompt", "You are a helpful AI assistant.")
        temperature = data.get("temperature", 0.7)

        chat_request = ChatRequest(
            message=message_content,
            history=history,
            model=model,
            system_prompt=system_prompt,
            temperature=temperature,
        )

        def generate_stream():
            """AI SDK v2.0.12準拠のストリーミング"""
            try:
                for chunk in chat_service.process_chat_stream(chat_request):
                    if chunk.get("type") == "data":
                        # AI SDK v2.0.12形式
                        yield f'0:"{escape_json_string(chunk["data"])}"\n'

                # ストリーミング完了
                completion_data = (
                    'd:{"finishReason":"stop","usage":'
                    '{"promptTokens":0,"completionTokens":0}}\n'
                )
                yield completion_data

            except Exception as e:
                # エラー時
                yield f'3:{{"error":"{escape_json_string(str(e))}"}}\n'

        return Response(
            generate_stream(),
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
    """ヘルスチェックエンドポイント"""
    return jsonify({"status": "healthy"}), 200


def extract_text_from_ui_message(ui_message: dict[str, Any]) -> str:
    """UIMessageからテキスト内容を抽出"""
    parts = ui_message.get("parts", [])
    text_parts = [part.get("text", "") for part in parts if part.get("type") == "text"]
    return "".join(text_parts) or ui_message.get("content", "")


def build_message_history(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """AI SDK標準メッセージからメッセージ履歴を構築"""
    history = []
    for msg in messages:
        if msg.get("role") in ["user", "assistant"]:
            history.append(
                {
                    "id": msg.get("id", str(len(history))),
                    "content": msg.get("content", ""),
                    "role": msg["role"],
                    "timestamp": int(time.time() * 1000),
                }
            )
    return history


def escape_json_string(text: str) -> str:
    """JSON文字列内で安全にエスケープ"""
    return text.replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r")
