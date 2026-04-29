import { useEffect, useRef, useState } from "react";
import { mockAssistantReplies, mockMessages } from "../../data/mockData";
import type { Chat } from "../../types/chat";
import type { ChatMessage as MessageType } from "../../types/message";
import { Button } from "../ui/Button";
import { InputArea } from "./InputArea";
import { MessageList } from "./MessageList";

type ChatWindowProps = {
  chat?: Chat;
  onOpenSettings: () => void;
};

const createMessage = (
  role: MessageType["role"],
  content: string
): MessageType => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  timestamp: new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date())
});

export function ChatWindow({ chat, onOpenSettings }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (content: string) => {
    const userMessage = createMessage("user", content);

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      const replyIndex = Math.floor(Math.random() * mockAssistantReplies.length);
      const assistantMessage = createMessage(
        "assistant",
        mockAssistantReplies[replyIndex]
      );

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setIsLoading(false);
      timeoutRef.current = null;
    }, 1400);
  };

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
      <MessageList isLoading={isLoading} messages={messages} />
      <InputArea isLoading={isLoading} onSubmit={handleSubmit} />
    </main>
  );
}
