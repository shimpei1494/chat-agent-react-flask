import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import ChatPage from './pages/chat/ChatPage';

function App() {
  return (
    <AppShell padding="md">
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;