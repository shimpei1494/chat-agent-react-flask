import { useCallback, useMemo } from 'react';
import type { ChatSettings, Message } from '../types/chat';
import { useAiChat } from './useAiChat';

export function useChat() {
  const aiChat = useAiChat();

  // Vercel AI SDKのメッセージを既存のMessage型に変換
  const messages: Message[] = useMemo(() => {
    return aiChat.messages.map((msg, index) => ({
      id: `msg-${index}`, // AI SDKにはIDがないので生成
      content: msg.content,
      role: msg.role as 'user' | 'assistant',
      timestamp: Date.now() - (aiChat.messages.length - index) * 1000, // 推定タイムスタンプ
    }));
  }, [aiChat.messages]);

  const sendMessage = useCallback(
    async (content: string, settings: ChatSettings) => {
      try {
        await aiChat.sendMessage(content, settings);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [aiChat],
  );

  const clearMessages = useCallback(() => {
    aiChat.clearMessages();
  }, [aiChat]);

  // 互換性のためのダミー関数
  const toggleStreaming = useCallback(() => {
    console.log('Streaming is always enabled with Vercel AI SDK');
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: aiChat.isLoading,
    typingIndicator: aiChat.isLoading,
    useStreaming: true, // AI SDKは常にストリーミング
    toggleStreaming,
    // AI SDK固有のプロパティは省略（streamState, streamingMessageIdは不要）
    streamState: undefined,
    streamingMessageId: null,
  };
}
