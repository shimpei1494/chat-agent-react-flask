from typing import Any, Dict, List

from app.types.chat_types import Message


class MessageBuilder:
    def build_messages(
        self,
        current_message: str,
        history: List[Message],
        system_prompt: str,
    ) -> List[Dict[str, Any]]:
        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": current_message})

        return messages