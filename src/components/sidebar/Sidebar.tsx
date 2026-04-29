import { useMemo, useState } from "react";
import type { Chat } from "../../types/chat";
import { Button } from "../ui/Button";
import { ChatList } from "./ChatList";
import { SearchInput } from "./SearchInput";

type SidebarProps = {
  activeChatId: string;
  chats: Chat[];
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (id: string) => void;
};

export function Sidebar({
  activeChatId,
  chats,
  isOpen,
  onClose,
  onSelectChat
}: SidebarProps) {
  const [searchValue, setSearchValue] = useState("");
  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [chats, searchValue]
  );

  const handleSelect = (id: string) => {
    onSelectChat(id);
    onClose();
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <Button className="sidebar__new-chat" variant="primary">
            <span aria-hidden="true">+</span>
            Новый чат
          </Button>
          <Button
            aria-label="Закрыть меню"
            className="sidebar__close"
            onClick={onClose}
            variant="ghost"
          >
            x
          </Button>
        </div>
        <SearchInput onChange={setSearchValue} value={searchValue} />
        <ChatList
          activeChatId={activeChatId}
          chats={filteredChats}
          onSelect={handleSelect}
        />
      </aside>
      {isOpen && <button className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}
