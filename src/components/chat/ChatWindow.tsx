import { useEffect, useRef, useState } from "react";
import type { Chat } from "../../types/chat";
import { sendChatCompletion } from "../../services/gigachat";
import { createMessage, useChatStore } from "../../store/chatStore";
import { Button } from "../ui/Button";
import { ErrorMessage } from "../ui/ErrorMessage";
import { InputArea } from "./InputArea";
import { MessageList } from "./MessageList";

type ChatWindowProps = {
  chat?: Chat;
  onOpenSettings: () => void;
};

export function ChatWindow({ chat, onOpenSettings }: ChatWindowProps) {
  const { addMessage, appendMessage, replaceMessage, settings } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (content: string) => {
    if (isLoading || !chat) {
      return;
    }

    const userMessage = createMessage("user", content);
    const assistantMessage = createMessage("assistant", "");
    const nextMessages = [...chat.messages, userMessage];
    const abortController = new AbortController();

    addMessage(chat.id, userMessage);
    addMessage(chat.id, assistantMessage);
    abortControllerRef.current = abortController;
    setError("");
    setIsLoading(true);

    try {
      const fullContent = await sendChatCompletion({
        messages: nextMessages,
        settings,
        signal: abortController.signal,
        onDelta: (delta) => appendMessage(chat.id, assistantMessage.id, delta)
      });

      if (!fullContent) {
        replaceMessage(
          chat.id,
          assistantMessage.id,
          "GigaChat вернул пустой ответ.",
          true
        );
      }
    } catch (requestError) {
      if (abortController.signal.aborted) {
        replaceMessage(
          chat.id,
          assistantMessage.id,
          "Генерация остановлена пользователем."
        );
      } else {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Не удалось получить ответ от GigaChat.";
        setError(message);
        replaceMessage(chat.id, assistantMessage.id, message, true);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
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
      {error && <ErrorMessage text={error} />}
      <MessageList isLoading={isLoading} messages={chat?.messages ?? []} />
      <InputArea
        isLoading={isLoading}
        onStop={handleStop}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
