import type { ChatMessage } from "../../types/chat";
import { EmptyState } from "../ui/EmptyState";
import { Message } from "./Message";
import { TypingIndicator } from "./TypingIndicator";

type MessageListProps = {
  messages: ChatMessage[];
  showTyping?: boolean;
};

export function MessageList({ messages, showTyping = true }: MessageListProps) {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div className="message message--assistant">
        <div className="message__avatar" aria-hidden="true">
          G
        </div>
        <TypingIndicator isVisible={showTyping} />
      </div>
    </div>
  );
}
