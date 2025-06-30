import { useState } from 'react';
import { Container, Stack } from '@mantine/core';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import Answer from '../../components/Answer/Answer';
import ClearChatButton from '../../components/ClearChatButton/ClearChatButton';
import SettingsButton from '../../components/SettingsButton/SettingsButton';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface ChatSettings {
  model: string;
  systemPrompt: string;
  temperature: number;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    model: 'gpt-4o-mini',
    systemPrompt: 'You are a helpful AI assistant.',
    temperature: 0.7,
  });

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          history: messages,
          model: settings.model,
          system_prompt: settings.systemPrompt,
          temperature: settings.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Container size="lg" h="100vh">
      <Stack h="100%" gap="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>AI Chat Agent</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <SettingsButton settings={settings} onSettingsChange={setSettings} />
            <ClearChatButton onClear={handleClearChat} />
          </div>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Stack gap="md">
            {messages.map((message) => (
              <Answer key={message.id} message={message} />
            ))}
          </Stack>
        </div>

        <QuestionInput onSend={handleSendMessage} disabled={isLoading} />
      </Stack>
    </Container>
  );
}

export default ChatPage;