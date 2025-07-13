from app.core.message_builder import MessageBuilder
from app.models.openai_client import OpenAIClient
from app.types.chat_types import ChatRequest, ChatResponse


class ChatService:
    def __init__(self):
        self.openai_client = OpenAIClient()
        self.message_builder = MessageBuilder()

    def process_chat(self, request: ChatRequest) -> ChatResponse:
        if request.model == "response-test":
            return ChatResponse(
                response=f"Test response: {request.message}", model=request.model
            )

        messages = self.message_builder.build_messages(
            request.message, request.history, request.system_prompt
        )

        response_text = self.openai_client.get_completion(
            messages=messages, model=request.model, temperature=request.temperature
        )

        return ChatResponse(response=response_text, model=request.model)

    def process_chat_stream(self, request: ChatRequest):
        if request.model == "response-test":
            test_response = f"Test response: {request.message}"
            for i, char in enumerate(test_response):
                yield {
                    "type": "data",
                    "data": char,
                    "metadata": {"position": i, "total": len(test_response)},
                }
            return

        messages = self.message_builder.build_messages(
            request.message, request.history, request.system_prompt
        )

        for chunk in self.openai_client.get_completion_stream(
            messages=messages, model=request.model, temperature=request.temperature
        ):
            yield chunk
