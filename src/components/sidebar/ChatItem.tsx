import type { Chat } from "../../types/chat";
import { Button } from "../ui/Button";

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onSelect: (id: string) => void;
};

export function ChatItem({
  chat,
  isActive,
  onDelete,
  onRename,
  onSelect
}: ChatItemProps) {
  const handleRename = () => {
    const title = window.prompt("Новое название чата", chat.title);
    if (title?.trim()) {
      onRename(chat.id, title);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить чат "${chat.title}"?`)) {
      onDelete(chat.id);
    }
  };

  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(chat.updatedAt));

  return (
    <li className={`chat-item ${isActive ? "chat-item--active" : ""}`}>
      <button
        className="chat-item__main"
        onClick={() => onSelect(chat.id)}
        type="button"
      >
        <span className="chat-item__content">
          <span className="chat-item__title">{chat.title}</span>
          <span className="chat-item__date">{formattedDate}</span>
        </span>
      </button>
      <span className="chat-item__actions">
        <Button
          aria-label="Редактировать чат"
          onClick={handleRename}
          type="button"
          variant="ghost"
        >
          ✎
        </Button>
        <Button
          aria-label="Удалить чат"
          onClick={handleDelete}
          type="button"
          variant="ghost"
        >
          ×
        </Button>
      </span>
    </li>
  );
}
