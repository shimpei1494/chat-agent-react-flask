import { Box, Button, Group, Textarea } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import styles from './QuestionInput.module.css';

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
    <Box
      className={styles.inputContainer}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '12px',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Group align="flex-end" gap="xs">
        <Textarea
          placeholder="メッセージを入力してください... (Enterで送信、Shift+Enterで改行)"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          autosize
          minRows={1}
          maxRows={6}
          style={{
            flex: 1,
          }}
          styles={{
            input: {
              border: 'none',
              borderRadius: '16px',
              background: 'transparent',
              padding: '12px 16px',
              fontSize: '14px',
              resize: 'none',
              color: 'var(--mantine-color-dark-9)',
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&::placeholder': {
                color: 'rgba(102, 126, 234, 0.6)',
                fontWeight: 400,
              },
            },
          }}
          disabled={disabled}
        />
        <Button
          className={`${styles.sendButton} ${
            !input.trim() || disabled ? styles.sendButtonDisabled : styles.sendButtonEnabled
          } ${input.trim() && !disabled ? styles.sendButtonPulse : ''}`}
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          size="sm"
          radius="xl"
          style={{
            background:
              !input.trim() || disabled
                ? 'rgba(102, 126, 234, 0.3)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            width: '40px',
            height: '40px',
            minWidth: '40px',
            padding: 0,
            boxShadow: !input.trim() || disabled ? 'none' : '0 3px 12px rgba(102, 126, 234, 0.3)',
          }}
        >
          <IconSend size={18} color="white" />
        </Button>
      </Group>
    </Box>
  );
}

export default QuestionInput;
