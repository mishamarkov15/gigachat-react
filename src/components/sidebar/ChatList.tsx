import type { Chat } from "../../types/chat";
import { ChatItem } from "./ChatItem";

type ChatListProps = {
  activeChatId: string;
  chats: Chat[];
  onSelect: (id: string) => void;
};

export function ChatList({ activeChatId, chats, onSelect }: ChatListProps) {
  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <ChatItem
          chat={chat}
          isActive={chat.id === activeChatId}
          key={chat.id}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
