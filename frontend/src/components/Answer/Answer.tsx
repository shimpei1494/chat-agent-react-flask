import { Avatar, Group, Paper, Text } from '@mantine/core';
import { IconRobot, IconUser } from '@tabler/icons-react';
import DOMPurify from 'dompurify';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface AnswerProps {
  message: Message;
}

function Answer({ message }: AnswerProps) {
  const isUser = message.role === 'user';
  const sanitizedContent = DOMPurify.sanitize(message.content);

  return (
    <Paper
      p="md"
      shadow="sm"
      style={{
        backgroundColor: isUser ? '#f0f9ff' : '#fafafa',
        marginLeft: isUser ? '20%' : '0',
        marginRight: isUser ? '0' : '20%',
      }}
    >
      <Group align="flex-start" gap="sm">
        <Avatar size="sm" color={isUser ? 'blue' : 'gray'}>
          {isUser ? <IconUser size={16} /> : <IconRobot size={16} />}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text size="sm" c="dimmed" mb={4}>
            {isUser ? 'You' : 'Assistant'}
          </Text>
          <Text
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </Group>
    </Paper>
  );
}

export default Answer;
