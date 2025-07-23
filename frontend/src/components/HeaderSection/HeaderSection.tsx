import { Box, Card, Flex, Group, Text, Title, useMantineTheme } from '@mantine/core';
import { memo } from 'react';
import type { ChatSettings } from '../../types/chat';
import ClearChatButton from '../ClearChatButton/ClearChatButton';
import SettingsButton from '../SettingsButton/SettingsButton';

interface HeaderSectionProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  onClearChat: () => void;
}

function HeaderSection({ settings, onSettingsChange, onClearChat }: HeaderSectionProps) {
  const theme = useMantineTheme();

  return (
    <Card
      style={{
        background: theme.other.glass.white,
        backdropFilter: theme.other.effects.blur,
        border: 'none',
        boxShadow: theme.other.shadows.card,
      }}
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Title order={1} size="2rem" style={theme.other.typography.gradient}>
            AI Chat Agent
          </Title>
          <Text c="dimmed" size="sm" mt={2}>
            Powered by advanced AI models
          </Text>
        </Box>
        <Group gap="xs">
          <SettingsButton settings={settings} onSettingsChange={onSettingsChange} />
          <ClearChatButton onClear={onClearChat} />
        </Group>
      </Flex>
    </Card>
  );
}

export default memo(HeaderSection);
