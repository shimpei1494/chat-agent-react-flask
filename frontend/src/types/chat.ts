export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatSettings {
  model: string;
  systemPrompt: string;
  temperature: number;
}

export interface ChatRequest {
  message: string;
  history: Message[];
  model: string;
  system_prompt: string;
  temperature: number;
}

export interface ChatResponse {
  response: string;
}
