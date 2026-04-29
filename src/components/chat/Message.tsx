import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types/chat";
import { Button } from "../ui/Button";

type MessageProps = {
  message: ChatMessage;
};

export function Message({ message }: MessageProps) {
  const handleCopy = () => {
    void navigator.clipboard?.writeText(message.text);
  };

  return (
    <article className={`message message--${message.variant}`}>
      {message.variant === "assistant" && (
        <div className="message__avatar" aria-hidden="true">
          G
        </div>
      )}
      <div className="message__bubble">
        <div className="message__meta">
          <span>{message.senderName}</span>
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
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
