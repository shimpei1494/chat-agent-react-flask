export interface ChatSettings {
  model: string;
  systemPrompt: string;
  temperature: number;
  provider: 'direct' | 'ai-sdk'; // 実装プロバイダーの選択
}

// 互換性のためのレガシー型（段階的に削除予定）
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

// バックエンド通信用（Flask API用）
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

// 旧実装で使用されていた型（削除予定）
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
