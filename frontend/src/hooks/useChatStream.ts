import { useCallback, useState } from 'react';
import { type ChatApiError, chatApi } from '../api/chatApi';
import type { ChatRequest, StreamChunk, StreamState } from '../types/chat';

export function useChatStream() {
  const [streamState, setStreamState] = useState<StreamState>({
    isStreaming: false,
    currentMessage: '',
    error: null,
    isComplete: false,
  });

  const sendMessageStream = useCallback(async (request: ChatRequest): Promise<string> => {
    setStreamState({
      isStreaming: true,
      currentMessage: '',
      error: null,
      isComplete: false,
    });

    return new Promise((resolve, reject) => {
      let fullMessage = '';

      const handleChunk = (chunk: StreamChunk) => {
        if (chunk.type === 'data' && chunk.data) {
          fullMessage += chunk.data;
          setStreamState((prev) => ({
            ...prev,
            currentMessage: fullMessage,
          }));
        }
      };

      const handleError = (error: ChatApiError) => {
        setStreamState((prev) => ({
          ...prev,
          error: error.message,
          isStreaming: false,
        }));
        reject(error);
      };

      const handleComplete = () => {
        setStreamState((prev) => ({
          ...prev,
          isStreaming: false,
          isComplete: true,
        }));
        resolve(fullMessage);
      };

      chatApi.sendMessageStream(request, handleChunk, handleError, handleComplete);
    });
  }, []);

  const resetStream = useCallback(() => {
    setStreamState({
      isStreaming: false,
      currentMessage: '',
      error: null,
      isComplete: false,
    });
  }, []);

  return {
    streamState,
    sendMessageStream,
    resetStream,
  };
}
