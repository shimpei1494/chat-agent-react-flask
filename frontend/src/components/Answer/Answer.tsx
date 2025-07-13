import { Avatar, Box, Group, Paper, Text } from '@mantine/core';
import { IconRobot } from '@tabler/icons-react';
import { memo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../../types/chat';
import styles from './Answer.module.css';

interface AnswerProps {
  message: Message;
  isStreaming?: boolean;
}

function Answer({ message, isStreaming = false }: AnswerProps) {
  const isUser = message.role === 'user';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      className={`${styles.messageContainer} ${isVisible ? styles.fadeIn : ''}`}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Group
        align="flex-start"
        gap="xs"
        style={{
          maxWidth: '75%',
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}
      >
        {/* Avatar - Hidden for user messages in modern chat style */}
        {!isUser && (
          <Avatar
            size={36}
            radius="xl"
            style={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
              flexShrink: 0,
            }}
          >
            <IconRobot size={16} color="white" />
          </Avatar>
        )}

        {/* Message bubble */}
        <Paper
          className={`${styles.messageHover} ${isUser ? styles.userMessageHover : styles.aiMessageHover}`}
          p="md"
          radius={isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px'}
          style={{
            background: isUser
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            backdropFilter: 'blur(20px)',
            boxShadow: isUser
              ? '0 4px 20px rgba(102, 126, 234, 0.25), 0 2px 8px rgba(0, 0, 0, 0.05)'
              : '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.05)',
            position: 'relative',
          }}
        >
          {/* Message content */}
          <Box>
            {/* Label - Only show for AI */}
            {!isUser && (
              <Text
                size="xs"
                c="dimmed"
                mb={4}
                fw={500}
                style={{ opacity: 0.8 }}
              >
                AI アシスタント
              </Text>
            )}

            {/* Message text */}
            {isUser ? (
              <Text
                size="sm"
                c="white"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                {message.content}
              </Text>
            ) : (
              <Box
                className={styles.markdownContent}
                style={{
                  color: 'var(--mantine-color-dark-7)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  position: 'relative',
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {isStreaming && (
                  <Box
                    component="span"
                    style={{
                      borderRight: '2px solid #667eea',
                      animation: 'blink 1s step-start infinite',
                      marginLeft: '2px',
                    }}
                  />
                )}
              </Box>
            )}

            {/* Timestamp */}
            <Text
              size="xs"
              c={isUser ? 'rgba(255, 255, 255, 0.7)' : 'dimmed'}
              mt={4}
              style={{
                textAlign: isUser ? 'right' : 'left',
                opacity: 0.6,
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Box>
        </Paper>
      </Group>
    </Box>
  );
}

export default memo(Answer);
