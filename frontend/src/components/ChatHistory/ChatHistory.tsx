import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconMessage,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';

interface ChatThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messageCount: number;
}

interface ChatHistoryProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  threads?: ChatThread[];
  currentThreadId?: string;
  onSelectThread?: (threadId: string) => void;
  onDeleteThread?: (threadId: string) => void;
  onRenameThread?: (threadId: string, newTitle: string) => void;
}

// Mock data for demonstration
const mockThreads: ChatThread[] = [
  {
    id: '1',
    title: 'UI改善について',
    lastMessage: 'ありがとうございました！',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    messageCount: 12,
  },
  {
    id: '2',
    title: 'React開発のベストプラクティス',
    lastMessage: 'TypeScriptとの組み合わせは...',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    messageCount: 8,
  },
  {
    id: '3',
    title: 'APIの設計について',
    lastMessage: 'RESTとGraphQLの違いは...',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    messageCount: 15,
  },
  {
    id: '4',
    title: 'データベース最適化',
    lastMessage: 'インデックスの効果的な使い方...',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    messageCount: 6,
  },
];

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}分前`;
  } else if (hours < 24) {
    return `${hours}時間前`;
  } else {
    return `${days}日前`;
  }
}

function ChatHistory({
  isCollapsed,
  onToggle,
  onNewChat,
  threads = mockThreads,
  currentThreadId,
  onSelectThread,
  onDeleteThread,
  onRenameThread,
}: ChatHistoryProps) {
  const [hoveredThread, setHoveredThread] = useState<string | null>(null);

  return (
    <Card
      radius="xl"
      p={isCollapsed ? 'sm' : 'lg'}
      h="100%"
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 255, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        border: 'none',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
        width: isCollapsed ? '80px' : '350px',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      <Stack h="100%" gap="md">
        {/* Header with toggle and new chat */}
        <Flex justify="space-between" align="center" h="40px">
          {!isCollapsed && (
            <Text fw={600} size="lg" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
              チャット履歴
            </Text>
          )}
          <Flex align="center" gap="xs" style={{ marginLeft: isCollapsed ? 0 : 'auto' }}>
            {!isCollapsed && (
              <Button
                size="sm"
                radius="xl"
                leftSection={<IconPlus size={16} />}
                onClick={onNewChat}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    },
                  },
                }}
              >
                新規チャット
              </Button>
            )}
            <ActionIcon
              variant="light"
              radius="xl"
              onClick={onToggle}
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                position: isCollapsed ? 'absolute' : 'static',
                top: isCollapsed ? '16px' : 'auto',
                right: isCollapsed ? '16px' : 'auto',
                zIndex: 10,
              }}
            >
              {isCollapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
            </ActionIcon>
          </Flex>
        </Flex>

        {isCollapsed ? (
          // Collapsed view - centered buttons with consistent spacing
          <Stack align="center" gap="sm" pt="md">
            <ActionIcon
              size="lg"
              radius="xl"
              onClick={onNewChat}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                width: '48px',
                height: '48px',
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  },
                },
              }}
            >
              <IconPlus size={20} />
            </ActionIcon>

            {/* Compact thread indicators */}
            <Stack gap="sm" w="100%" align="center">
              {threads.slice(0, 4).map((thread) => (
                <ActionIcon
                  key={thread.id}
                  variant="light"
                  radius="lg"
                  onClick={() => onSelectThread?.(thread.id)}
                  style={{
                    background:
                      currentThreadId === thread.id
                        ? 'rgba(102, 126, 234, 0.2)'
                        : 'rgba(102, 126, 234, 0.1)',
                    border: `1px solid ${
                      currentThreadId === thread.id
                        ? 'rgba(102, 126, 234, 0.4)'
                        : 'rgba(102, 126, 234, 0.2)'
                    }`,
                    width: '48px',
                    height: '48px',
                  }}
                >
                  <IconMessage size={16} />
                </ActionIcon>
              ))}
            </Stack>
          </Stack>
        ) : (
          // Expanded view
          <>
            <Divider />

            <ScrollArea flex={1} type="never">
              <Stack gap="xs">
                {threads.map((thread) => (
                  <Card
                    key={thread.id}
                    padding="md"
                    radius="lg"
                    style={{
                      background:
                        currentThreadId === thread.id
                          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%)'
                          : hoveredThread === thread.id
                            ? 'rgba(102, 126, 234, 0.04)'
                            : 'transparent',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow:
                        currentThreadId === thread.id
                          ? '0 2px 8px rgba(102, 126, 234, 0.1)'
                          : 'none',
                    }}
                    onMouseEnter={() => setHoveredThread(thread.id)}
                    onMouseLeave={() => setHoveredThread(null)}
                    onClick={() => onSelectThread?.(thread.id)}
                  >
                    <Group justify="space-between" align="flex-start" gap="xs">
                      <Box flex={1} style={{ minWidth: 0 }}>
                        <Text
                          fw={currentThreadId === thread.id ? 600 : 500}
                          size="sm"
                          truncate
                          mb={2}
                        >
                          {thread.title}
                        </Text>
                        <Text size="xs" c="dimmed" truncate mb={4}>
                          {thread.lastMessage}
                        </Text>
                        <Group justify="space-between" align="center">
                          <Text size="xs" c="dimmed">
                            {formatTimestamp(thread.timestamp)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {thread.messageCount}件
                          </Text>
                        </Group>
                      </Box>

                      <Box
                        style={{
                          width: '44px', // Fixed width to prevent layout shifts
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-start',
                        }}
                      >
                        {hoveredThread === thread.id && (
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRenameThread?.(thread.id, thread.title);
                              }}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteThread?.(thread.id);
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        )}
                      </Box>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
          </>
        )}
      </Stack>
    </Card>
  );
}

export default ChatHistory;
