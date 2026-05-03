import { useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { ChatWindow } from "../chat/ChatWindow";
import { SettingsPanel } from "../settings/SettingsPanel";
import { Sidebar } from "../sidebar/Sidebar";
import { Button } from "../ui/Button";

type AppLayoutProps = {
  isDarkTheme: boolean;
  onThemeChange: (isDark: boolean) => void;
};

export function AppLayout({ isDarkTheme, onThemeChange }: AppLayoutProps) {
  const { activeChat, activeChatId, chats, selectChat } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        chats={chats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectChat={selectChat}
      />
      <ChatWindow
        chat={activeChat}
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
