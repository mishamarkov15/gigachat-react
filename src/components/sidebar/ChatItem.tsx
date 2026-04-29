import type { Chat } from "../../types/chat";
import { Button } from "../ui/Button";

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onSelect: (id: string) => void;
};

export function ChatItem({ chat, isActive, onSelect }: ChatItemProps) {
  return (
    <li>
      <button
        className={`chat-item ${isActive ? "chat-item--active" : ""}`}
        onClick={() => onSelect(chat.id)}
        type="button"
      >
        <span className="chat-item__content">
          <span className="chat-item__title">{chat.title}</span>
          <span className="chat-item__date">{chat.lastMessageDate}</span>
        </span>
        <span className="chat-item__actions">
          <Button aria-label="Редактировать чат" variant="ghost">
            edit
          </Button>
          <Button aria-label="Удалить чат" variant="ghost">
            del
          </Button>
        </span>
      </button>
    </li>
  );
}
