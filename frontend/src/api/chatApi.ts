import type { ChatRequest, ChatResponse, StreamChunk } from '../types/chat';

export class ChatApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ChatApiError';
  }
}

export class ChatApi {
  private baseUrl = '/api';

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ChatApiError(
          errorData.error || 'Failed to get response',
          response.status,
          errorData,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ChatApiError) {
        throw error;
      }
      throw new ChatApiError('Network error occurred', undefined, error);
    }
  }

  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`/api/health`);
      if (!response.ok) {
        throw new ChatApiError('Health check failed', response.status);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ChatApiError) {
        throw error;
      }
      throw new ChatApiError('Health check network error', undefined, error);
    }
  }

  async sendMessageStream(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
    onError: (error: ChatApiError) => void,
    onComplete: () => void,
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ChatApiError(
          errorData.error || 'Failed to get response',
          response.status,
          errorData,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new ChatApiError('No readable stream available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim()) {
                try {
                  const chunk: StreamChunk = JSON.parse(data);
                  onChunk(chunk);

                  if (chunk.type === 'complete') {
                    onComplete();
                    return;
                  } else if (chunk.type === 'error') {
                    onError(new ChatApiError(chunk.error || 'Stream error'));
                    return;
                  }
                } catch (parseError) {
                  console.warn('Failed to parse chunk:', data, parseError);
                }
              }
            }
          }
        }
        onComplete();
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof ChatApiError) {
        onError(error);
      } else {
        onError(new ChatApiError('Network error occurred', undefined, error));
      }
    }
  }
}

export const chatApi = new ChatApi();
