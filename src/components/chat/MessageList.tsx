import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../types/message";
import { EmptyState } from "../ui/EmptyState";
import { Message } from "./Message";
import { TypingIndicator } from "./TypingIndicator";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="message message--assistant">
          <div className="message__avatar" aria-hidden="true">
            G
          </div>
          <TypingIndicator isVisible={isLoading} />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
