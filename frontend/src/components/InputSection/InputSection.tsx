import { Card, useMantineTheme } from '@mantine/core';
import { memo } from 'react';
import QuestionInput from '../QuestionInput/QuestionInput';

interface InputSectionProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

function InputSection({ onSend, disabled }: InputSectionProps) {
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
      <QuestionInput onSend={onSend} disabled={disabled} />
    </Card>
  );
}

export default memo(InputSection);
