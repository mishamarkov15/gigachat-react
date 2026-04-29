import type { Chat, ChatMessage } from "../../types/chat";
import { Button } from "../ui/Button";
import { InputArea } from "./InputArea";
import { MessageList } from "./MessageList";

type ChatWindowProps = {
  chat?: Chat;
  messages: ChatMessage[];
  onOpenSettings: () => void;
};

export function ChatWindow({ chat, messages, onOpenSettings }: ChatWindowProps) {
  return (
    <main className="chat-window">
      <header className="chat-window__header">
        <div>
          <span className="chat-window__eyebrow">Текущий чат</span>
          <h1>{chat?.title ?? "Новый чат"}</h1>
        </div>
        <Button
          className="chat-window__settings"
          onClick={onOpenSettings}
          type="button"
          variant="secondary"
        >
          <span className="chat-window__settings-icon" aria-hidden="true">
            ⚙
          </span>
          <span className="chat-window__settings-text">Настройки</span>
        </Button>
      </header>
      <MessageList messages={messages} showTyping />
      <InputArea onSubmit={() => undefined} />
    </main>
  );
}
