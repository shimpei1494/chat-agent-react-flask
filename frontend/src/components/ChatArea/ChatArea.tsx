import { Avatar, Box, Card, Flex, Group, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { IconRobot } from '@tabler/icons-react';
import { memo } from 'react';
import type { Message, StreamState } from '../../types/chat';
import Answer from '../Answer/Answer';
import styles from './ChatArea.module.css';

interface ChatAreaProps {
  messages: Message[];
  typingIndicator: boolean;
  streamState?: StreamState;
  streamingMessageId?: string | null;
}

function ChatArea({ messages, typingIndicator, streamState, streamingMessageId }: ChatAreaProps) {
  const theme = useMantineTheme();

  return (
    <Card
      style={{
        flex: 1,
        background: theme.other.glass.light,
        backdropFilter: theme.other.effects.blur,
        border: 'none',
        boxShadow: theme.other.shadows.cardLight,
        overflow: 'hidden',
      }}
    >
      <Box
        h="100%"
        className={styles.chatArea}
        style={{ overflow: 'auto', padding: theme.other.spacing.md }}
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <Box>
            {messages.map((message) => {
              const isStreaming = streamingMessageId === message.id && streamState?.isStreaming;
              const displayContent = isStreaming
                ? streamState?.currentMessage || message.content
                : message.content;

              return (
                <Answer
                  key={message.id}
                  message={{ ...message, content: displayContent }}
                  isStreaming={isStreaming}
                />
              );
            })}
            {typingIndicator && <TypingIndicator />}
          </Box>
        )}
      </Box>
    </Card>
  );
}

function EmptyState() {
  const theme = useMantineTheme();

  return (
    <Flex h="100%" direction="column" justify="center" align="center" gap="md">
      <Box
        w={120}
        h={120}
        style={{
          background: theme.other.gradients.accent,
          borderRadius: theme.other.borderRadius.round,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: theme.other.shadows.icon,
        }}
      >
        <IconRobot size={48} color="white" />
      </Box>
      <Title order={3} ta="center" c="dimmed">
        こんにちは！何かお手伝いできることはありますか？
      </Title>
      <Text ta="center" c="dimmed" size="sm">
        何でもお気軽にお聞きください。AIがお答えします。
      </Text>
    </Flex>
  );
}

function TypingIndicator() {
  const theme = useMantineTheme();

  return (
    <Box
      className={styles.typingIndicator}
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: theme.other.spacing.md,
      }}
    >
      <Group align="flex-start" gap="xs">
        <Avatar
          size={36}
          radius="xl"
          style={{
            background: theme.other.gradients.accent,
            boxShadow: theme.other.shadows.avatar,
          }}
        >
          <IconRobot size={16} color="white" />
        </Avatar>
        <Paper
          p="md"
          radius="20px 20px 20px 4px"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            backdropFilter: theme.other.effects.blur,
            boxShadow: theme.other.shadows.aiMessage,
            minWidth: '60px',
          }}
        >
          <Box>
            <Text size="xs" c="dimmed" mb={4} fw={500} style={{ opacity: 0.8 }}>
              AI アシスタント
            </Text>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.other.spacing.xs,
              }}
            >
              <Box className={styles.typingDot} />
              <Box className={styles.typingDot} />
              <Box className={styles.typingDot} />
            </Box>
          </Box>
        </Paper>
      </Group>
    </Box>
  );
}

export default memo(ChatArea);
