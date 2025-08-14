import { useCallback, useState } from 'react';
import type { ChatSettings, Message } from '../types/chat';

interface UseAiSdkChatOptions {
  settings?: ChatSettings;
}

// TODO: AI SDK v2.0.12の正しい実装方法を調査後、本格実装
// 現在は直接実装と同じ動作をする仮実装
export function useAiSdkChat(_options: UseAiSdkChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading] = useState(false);
  const [input, setInput] = useState('');

  const sendMessage = useCallback(async (_content: string, _messageSettings?: ChatSettings) => {
    console.warn('AI SDK実装は開発中です。直接実装を使用してください。');
    // 現在は何も行わない
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input.trim());
        setInput('');
      }
    },
    [input, sendMessage],
  );

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    typingIndicator: isLoading,
    useStreaming: true,
    // AI SDK固有の機能（仮実装）
    input,
    handleInputChange,
    handleSubmit,
    error: null,
    stop: () => {},
  };
}
