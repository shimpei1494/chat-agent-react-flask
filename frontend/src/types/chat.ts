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

export interface StreamChunk {
  type: 'data' | 'error' | 'complete';
  data?: string;
  error?: string;
  metadata?: {
    model?: string;
    finish_reason?: string;
    position?: number;
    total?: number;
  };
}

export interface StreamState {
  isStreaming: boolean;
  currentMessage: string;
  error: string | null;
  isComplete: boolean;
}
