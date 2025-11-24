import type { ChatSettings } from '../types/chat';
import { useAiSdkChat } from './useAiSdkChat';
import { useChat } from './useChat';

interface UseChatProviderOptions {
  provider: 'direct' | 'ai-sdk';
  settings?: ChatSettings;
}

export function useChatProvider(options: UseChatProviderOptions = { provider: 'direct' }) {
  const { provider, settings } = options;

  // 現在の直接実装（安定版）
  const directChat = useChat();

  // AI SDK実装（将来の拡張用）
  const aiSdkChat = useAiSdkChat({ settings });

  const selectedChat = provider === 'ai-sdk' ? aiSdkChat : directChat;

  // 統一されたインターフェース
  return {
    ...selectedChat,
    provider,
    // 将来の拡張機能（AI SDKでのみ利用可能）
    advanced: {
      // ツール呼び出し、マルチモーダル等の高度な機能
      toolCalling: provider === 'ai-sdk',
      multiModal: provider === 'ai-sdk',
      // AI SDK固有の機能
      ...(provider === 'ai-sdk' && {
        input: aiSdkChat.input,
        handleInputChange: aiSdkChat.handleInputChange,
        handleSubmit: aiSdkChat.handleSubmit,
        stop: aiSdkChat.stop,
      }),
    },
  };
}
