import { useState } from 'react';
import type { ChatSettings } from '../types/chat';

const DEFAULT_SETTINGS: ChatSettings = {
  model: 'gpt-4o-mini',
  systemPrompt: 'You are a helpful AI assistant.',
  temperature: 0.7,
  provider: 'direct', // デフォルトは安定した直接実装
};

export function useSettings() {
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

  return {
    settings,
    setSettings,
  };
}
