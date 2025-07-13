import {
  Button,
  Modal,
  Select,
  Slider,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useState } from 'react';

interface ChatSettings {
  model: string;
  systemPrompt: string;
  temperature: number;
}

interface SettingsButtonProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

const MODEL_OPTIONS = [
  { value: 'response-test', label: 'Response Test (Demo)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gemini', label: 'Gemini' },
];

function SettingsButton({ settings, onSettingsChange }: SettingsButtonProps) {
  const [opened, setOpened] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setOpened(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setOpened(false);
  };

  return (
    <>
      <Button
        variant="light"
        leftSection={<IconSettings size={16} />}
        onClick={() => setOpened(true)}
        radius="xl"
        style={{
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          color: '#667eea',
          transition: 'all 0.3s ease',
        }}
        styles={{
          root: {
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.2)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            },
          },
        }}
      >
        設定
      </Button>

      <Modal
        opened={opened}
        onClose={handleCancel}
        title="Chat Settings"
        size="md"
      >
        <Stack gap="md">
          <Select
            label="AI Model"
            description="Choose the AI model for responses"
            data={MODEL_OPTIONS}
            value={localSettings.model}
            onChange={(value) =>
              setLocalSettings({
                ...localSettings,
                model: value || 'gpt-4o-mini',
              })
            }
          />

          <Textarea
            label="System Prompt"
            description="Define how the AI should behave"
            placeholder="You are a helpful AI assistant..."
            value={localSettings.systemPrompt}
            onChange={(event) =>
              setLocalSettings({
                ...localSettings,
                systemPrompt: event.currentTarget.value,
              })
            }
            autosize
            minRows={3}
            maxRows={6}
          />

          <div>
            <Text size="sm" fw={500} mb={4}>
              Temperature: {localSettings.temperature.toFixed(1)}
            </Text>
            <Text size="xs" c="dimmed" mb={8}>
              Controls randomness (0.0 = focused, 1.0 = creative)
            </Text>
            <Slider
              value={localSettings.temperature}
              onChange={(value) =>
                setLocalSettings({ ...localSettings, temperature: value })
              }
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '0.0' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1.0' },
              ]}
            />
          </div>

          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
          >
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </Stack>
      </Modal>
    </>
  );
}

export default SettingsButton;
