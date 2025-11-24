import { Box, Flex, useMantineTheme } from '@mantine/core';
import { useCallback } from 'react';
import ChatArea from '../../components/ChatArea/ChatArea';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import HeaderSection from '../../components/HeaderSection/HeaderSection';
import InputSection from '../../components/InputSection/InputSection';
import { useChatProvider } from '../../hooks/useChatProvider';
import { useSettings } from '../../hooks/useSettings';
import { useSidebar } from '../../hooks/useSidebar';

function ChatPage() {
  const { settings, setSettings } = useSettings();
  const { messages, isLoading, typingIndicator, sendMessage, clearMessages } = useChatProvider({
    provider: settings.provider,
    settings,
  });
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const theme = useMantineTheme();

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content, settings);
    },
    [sendMessage, settings],
  );

  const handleClearChat = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const handleNewChat = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  return (
    <Box
      h="100vh"
      w="100vw"
      style={{
        background: theme.other.gradients.background,
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      {/* Background pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.other.gradients.backgroundPattern,
        }}
      />

      {/* Main layout with sidebar */}
      <Flex h="100%" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left Sidebar */}
        <Box p="md" style={{ flexShrink: 0 }}>
          <ChatHistory
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            onNewChat={handleNewChat}
          />
        </Box>

        {/* Main Content Area */}
        <Box flex={1} p="md" pl={0}>
          <Flex direction="column" h="100%" gap="md">
            {/* Header */}
            <HeaderSection
              settings={settings}
              onSettingsChange={setSettings}
              onClearChat={handleClearChat}
            />

            {/* Chat Area */}
            <ChatArea messages={messages} typingIndicator={typingIndicator} />

            {/* Input Area */}
            <InputSection onSend={handleSendMessage} disabled={isLoading} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default ChatPage;
