import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def get_completion(
        self,
        messages: List[Dict[str, Any]],
        model: str = "gpt-4o-mini",
        temperature: float = 0.7,
    ) -> str:
        if model == "gemini":
            # For now, use GPT-4o-mini for Gemini requests
            # In a real implementation, you would use Google's Gemini API
            model = "gpt-4o-mini"

        try:
            response = self.client.chat.completions.create(
                model=model, messages=messages, temperature=temperature, max_tokens=4000
            )

            return response.choices[0].message.content or "No response generated"

        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
