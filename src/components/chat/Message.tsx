import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types/message";
import { Button } from "../ui/Button";

type MessageProps = {
  message: ChatMessage;
};

export function Message({ message }: MessageProps) {
  const variant = message.role;
  const senderName = message.role === "user" ? "Вы" : "GigaChat";
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  const handleCopy = async () => {
    await navigator.clipboard?.writeText(message.content);
    setIsCopied(true);
  };

  return (
    <article className={`message message--${variant}`}>
      {variant === "assistant" && (
        <div className="message__avatar" aria-hidden="true">
          G
        </div>
      )}
      <div className="message__bubble">
        <div className="message__meta">
          <span>
            {senderName} · {message.timestamp}
          </span>
          {variant === "assistant" && (
            <Button
              className={`message__copy ${
                isCopied ? "message__copy--copied" : ""
              }`}
              onClick={handleCopy}
              type="button"
              variant="ghost"
            >
              {isCopied ? "Скопировано" : "Копировать"}
            </Button>
          )}
        </div>
        <div className="message__content">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
