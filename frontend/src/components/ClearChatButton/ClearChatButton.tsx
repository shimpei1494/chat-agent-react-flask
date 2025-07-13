import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface ClearChatButtonProps {
  onClear: () => void;
}

function ClearChatButton({ onClear }: ClearChatButtonProps) {
  return (
    <Button
      variant="light"
      leftSection={<IconTrash size={16} />}
      onClick={onClear}
      radius="xl"
      style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
        transition: 'all 0.3s ease',
      }}
      styles={{
        root: {
          '&:hover': {
            background: 'rgba(239, 68, 68, 0.2)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
          },
        },
      }}
    >
      クリア
    </Button>
  );
}

export default ClearChatButton;
