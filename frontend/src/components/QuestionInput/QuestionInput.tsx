import { useState } from 'react';
import { Textarea, Button, Group } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

interface QuestionInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

function QuestionInput({ onSend, disabled = false }: QuestionInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Group align="flex-end" gap="sm">
      <Textarea
        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
        value={input}
        onChange={(event) => setInput(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        autosize
        minRows={1}
        maxRows={10}
        style={{ flex: 1 }}
        disabled={disabled}
      />
      <Button
        onClick={handleSubmit}
        disabled={!input.trim() || disabled}
        leftSection={<IconSend size={16} />}
      >
        Send
      </Button>
    </Group>
  );
}

export default QuestionInput;