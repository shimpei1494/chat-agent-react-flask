import { useChat } from '@ai-sdk/react';
import { useCallback } from 'react';
import type { ChatSettings } from '../types/chat';

interface UseAiChatOptions {
  settings?: ChatSettings;
}

export function useAiChat(options: UseAiChatOptions = {}) {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    reload,
    append,
  } = useChat({
    api: '/api/v1/chat/ai-sdk',
    body: options.settings
      ? {
          model: options.settings.model,
          system_prompt: options.settings.systemPrompt,
          temperature: options.settings.temperature,
        }
      : undefined,
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  // 設定を含むメッセージ送信関数
  const sendMessage = useCallback(
    async (content: string, settings?: ChatSettings) => {
      if (settings) {
        // 設定付きでメッセージ送信
        await append(
          { role: 'user', content },
          {
            body: {
              model: settings.model,
              system_prompt: settings.systemPrompt,
              temperature: settings.temperature,
            },
          },
        );
      } else {
        // デフォルト設定でメッセージ送信
        await append({ role: 'user', content });
      }
    },
    [append],
  );

  // メッセージクリア
  const clearMessages = useCallback(() => {
    // useChatにはclear機能がないため、ページをリロードするか、
    // 独自の状態管理を実装する必要がある
    window.location.reload();
  }, []);

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    reload,
    sendMessage,
    clearMessages,
    // 互換性のための追加プロパティ
    typingIndicator: isLoading,
  };
}
