import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface ClearChatButtonProps {
  onClear: () => void;
}

function ClearChatButton({ onClear }: ClearChatButtonProps) {
  return (
    <Button
      variant="outline"
      color="red"
      leftSection={<IconTrash size={16} />}
      onClick={onClear}
    >
      Clear
    </Button>
  );
}

export default ClearChatButton;