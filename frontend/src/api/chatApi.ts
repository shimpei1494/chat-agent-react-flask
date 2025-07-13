import type { ChatRequest, ChatResponse } from '../types/chat';

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
  private baseUrl = '/api/v1';

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
      const response = await fetch(`${this.baseUrl}/health`);
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
}

export const chatApi = new ChatApi();
