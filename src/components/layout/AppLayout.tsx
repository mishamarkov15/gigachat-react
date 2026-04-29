import { useMemo, useState } from "react";
import { mockChats, mockMessages } from "../../data/mockData";
import { ChatWindow } from "../chat/ChatWindow";
import { SettingsPanel } from "../settings/SettingsPanel";
import { Sidebar } from "../sidebar/Sidebar";
import { Button } from "../ui/Button";

type AppLayoutProps = {
  isDarkTheme: boolean;
  onThemeChange: (isDark: boolean) => void;
};

export function AppLayout({ isDarkTheme, onThemeChange }: AppLayoutProps) {
  const [activeChatId, setActiveChatId] = useState(mockChats[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const activeChat = useMemo(
    () => mockChats.find((chat) => chat.id === activeChatId),
    [activeChatId]
  );

  return (
    <div className="app-layout">
      <Button
        aria-label="Открыть меню"
        className="burger-button"
        onClick={() => setIsSidebarOpen(true)}
        variant="secondary"
      >
        ☰
      </Button>
      <Sidebar
        activeChatId={activeChatId}
        chats={mockChats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectChat={setActiveChatId}
      />
      <ChatWindow
        chat={activeChat}
        messages={mockMessages}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <SettingsPanel
        isDarkTheme={isDarkTheme}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onThemeChange={onThemeChange}
      />
    </div>
  );
}
