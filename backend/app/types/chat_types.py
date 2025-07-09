from typing import List, Literal

from pydantic import BaseModel, Field


class Message(BaseModel):
    id: str
    content: str
    role: Literal["user", "assistant"]
    timestamp: int


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    history: List[Message] = Field(default_factory=list)
    model: str = Field(default="gpt-4o-mini")
    system_prompt: str = Field(default="You are a helpful AI assistant.")
    temperature: float = Field(default=0.7, ge=0.0, le=1.0)


class ChatResponse(BaseModel):
    response: str
    model: str
