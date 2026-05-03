import type { Chat } from "../../types/chat";
import { ChatItem } from "./ChatItem";

type ChatListProps = {
  activeChatId: string;
  chats: Chat[];
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onSelect: (id: string) => void;
};

export function ChatList({
  activeChatId,
  chats,
  onDelete,
  onRename,
  onSelect
}: ChatListProps) {
  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <ChatItem
          chat={chat}
          isActive={chat.id === activeChatId}
          key={chat.id}
          onDelete={onDelete}
          onRename={onRename}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
