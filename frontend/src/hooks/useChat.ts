import { useCallback, useState } from 'react';
import { ChatApiError, chatApi } from '../api/chatApi';
import type { ChatSettings, Message } from '../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);

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

      try {
        const response = await chatApi.sendMessage({
          message: content,
          history: messages,
          model: settings.model,
          system_prompt: settings.systemPrompt,
          temperature: settings.temperature,
        });

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: response.response,
          role: 'assistant',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
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

        const errorMessage: Message = {
          id: crypto.randomUUID(),
          content: errorContent,
          role: 'assistant',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setTypingIndicator(false);
      } finally {
        setIsLoading(false);
        setTypingIndicator(false);
      }
    },
    [messages],
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
  };
}
