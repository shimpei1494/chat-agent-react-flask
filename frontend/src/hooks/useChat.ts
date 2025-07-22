import { useCallback, useState } from 'react';
import { ChatApiError, chatApi } from '../api/chatApi';
import type { ChatSettings, Message } from '../types/chat';
import { useChatStream } from './useChatStream';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);
  const { streamState, sendMessageStream, resetStream } = useChatStream();
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string, settings: ChatSettings) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setTypingIndicator(true);
      resetStream();

      // Create placeholder message for streaming
      const assistantMessageId = crypto.randomUUID();
      setStreamingMessageId(assistantMessageId);

      const placeholderMessage: Message = {
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, placeholderMessage]);

      try {
        if (useStreaming) {
          const fullResponse = await sendMessageStream({
            message: content,
            history: messages,
            model: settings.model,
            system_prompt: settings.systemPrompt,
            temperature: settings.temperature,
          });

          // Update final message with complete response
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg,
            ),
          );
        } else {
          // Fallback to non-streaming
          const response = await chatApi.sendMessage({
            message: content,
            history: messages,
            model: settings.model,
            system_prompt: settings.systemPrompt,
            temperature: settings.temperature,
          });

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: response.response } : msg,
            ),
          );
        }

        setTypingIndicator(false);
      } catch (error) {
        console.error('Error:', error);

        let errorContent = 'Sorry, there was an error processing your request.';
        if (error instanceof ChatApiError) {
          if (error.status === 429) {
            errorContent = 'Too many requests. Please try again later.';
          } else if (error.status === 500) {
            errorContent = 'Server error occurred. Please try again.';
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: errorContent } : msg,
          ),
        );
        setTypingIndicator(false);
      } finally {
        setIsLoading(false);
        setTypingIndicator(false);
        setStreamingMessageId(null);
      }
    },
    [messages, useStreaming, sendMessageStream, resetStream],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    typingIndicator,
    sendMessage,
    clearMessages,
    streamState,
    streamingMessageId,
    useStreaming,
    setUseStreaming,
  };
}
