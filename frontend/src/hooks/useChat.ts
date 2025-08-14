import { useCallback, useState } from 'react';
import type { ChatSettings, Message } from '../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string, settings: ChatSettings) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        // ユーザーメッセージをすぐに追加
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          content,
          role: 'user',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // AIレスポンス用の空メッセージを作成
        const aiMessageId = `ai-${Date.now()}`;
        const aiMessage: Message = {
          id: aiMessageId,
          content: '',
          role: 'assistant',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // 新しいAPI形式でリクエスト
        const requestMessages = [
          ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: 'user' as const, content },
        ];

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: requestMessages,
            model: settings.model,
            system_prompt: settings.systemPrompt,
            temperature: settings.temperature,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:"')) {
              // AI SDK v2.0.12形式のデータチャンク
              const data = line.slice(3, -1); // '0:"' と '"' を除去
              fullContent += data.replace(/\\"/g, '"').replace(/\\n/g, '\n');

              // リアルタイム更新
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId ? { ...msg, content: fullContent } : msg,
                ),
              );
            } else if (line.startsWith('d:')) {
              // 完了シグナル
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // エラー時は最後のassistantメッセージを削除
        setMessages((prev) => {
          for (let i = prev.length - 1; i >= 0; i--) {
            if (prev[i].role === 'assistant') {
              return prev.filter((_, index) => index !== i);
            }
          }
          return prev;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const toggleStreaming = useCallback(() => {
    console.log('Streaming is always enabled');
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    typingIndicator: isLoading,
    useStreaming: true,
    toggleStreaming,
    streamState: undefined,
    streamingMessageId: null,
  };
}
