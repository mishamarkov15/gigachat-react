import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types/message";
import { Button } from "../ui/Button";

type MessageProps = {
  message: ChatMessage;
};

export function Message({ message }: MessageProps) {
  const variant = message.role;
  const senderName = message.role === "user" ? "Вы" : "GigaChat";

  const handleCopy = () => {
    void navigator.clipboard?.writeText(message.content);
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
          <Button
            className="message__copy"
            onClick={handleCopy}
            type="button"
            variant="ghost"
          >
            Копировать
          </Button>
        </div>
        <div className="message__content">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
