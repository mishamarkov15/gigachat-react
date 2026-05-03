import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "react";
import type { ReactNode } from "react";
import type { Chat } from "../types/chat";
import type { ChatMessage } from "../types/message";
import { defaultSettings, type ChatSettings } from "../types/settings";

const STORAGE_KEY = "gigachat.final.state";

type ChatState = {
  activeChatId: string;
  chats: Chat[];
  settings: ChatSettings;
};

type ChatAction =
  | { type: "createChat"; id: string; now: string }
  | { type: "selectChat"; id: string }
  | { type: "renameChat"; id: string; title: string }
  | { type: "deleteChat"; id: string }
  | { type: "addMessage"; chatId: string; message: ChatMessage }
  | { type: "appendMessage"; chatId: string; messageId: string; delta: string }
  | {
      type: "replaceMessage";
      chatId: string;
      messageId: string;
      content: string;
      error?: boolean;
    }
  | { type: "updateSettings"; settings: ChatSettings };

type ChatContextValue = ChatState & {
  activeChat: Chat;
  createChat: () => string;
  selectChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  appendMessage: (chatId: string, messageId: string, delta: string) => void;
  replaceMessage: (
    chatId: string,
    messageId: string,
    content: string,
    error?: boolean
  ) => void;
  updateSettings: (settings: ChatSettings) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeChat =
    state.chats.find((chat) => chat.id === state.activeChatId) || state.chats[0];

  const value = useMemo<ChatContextValue>(
    () => ({
      ...state,
      activeChat,
      createChat: () => {
        const id = createId("chat");
        dispatch({ type: "createChat", id, now: new Date().toISOString() });
        return id;
      },
      selectChat: (id) => dispatch({ type: "selectChat", id }),
      renameChat: (id, title) => dispatch({ type: "renameChat", id, title }),
      deleteChat: (id) => dispatch({ type: "deleteChat", id }),
      addMessage: (chatId, message) =>
        dispatch({ type: "addMessage", chatId, message }),
      appendMessage: (chatId, messageId, delta) =>
        dispatch({ type: "appendMessage", chatId, messageId, delta }),
      replaceMessage: (chatId, messageId, content, error) =>
        dispatch({ type: "replaceMessage", chatId, messageId, content, error }),
      updateSettings: (settings) =>
        dispatch({ type: "updateSettings", settings })
    }),
    [activeChat, state]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatStore() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatStore must be used inside ChatProvider");
  }
  return context;
}

export function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: createId(role),
    role,
    content,
    timestamp: new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date())
  };
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "createChat": {
      const chat = createEmptyChat(action.id, action.now);
      return {
        ...state,
        activeChatId: chat.id,
        chats: [chat, ...state.chats]
      };
    }
    case "selectChat":
      return { ...state, activeChatId: action.id };
    case "renameChat":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.id ? { ...chat, title: action.title.trim() } : chat
        )
      };
    case "deleteChat": {
      const remainingChats = state.chats.filter((chat) => chat.id !== action.id);
      const chats = remainingChats.length
        ? remainingChats
        : [createEmptyChat(createId("chat"), new Date().toISOString())];
      return {
        ...state,
        activeChatId:
          state.activeChatId === action.id ? chats[0].id : state.activeChatId,
        chats
      };
    }
    case "addMessage":
      return updateChat(state, action.chatId, (chat) => {
        const isFirstUserMessage =
          action.message.role === "user" &&
          chat.messages.filter((message) => message.role === "user").length === 0;

        return {
          ...chat,
          title: isFirstUserMessage
            ? createTitleFromMessage(action.message.content)
            : chat.title,
          updatedAt: new Date().toISOString(),
          messages: [...chat.messages, action.message]
        };
      });
    case "appendMessage":
      return updateChat(state, action.chatId, (chat) => ({
        ...chat,
        updatedAt: new Date().toISOString(),
        messages: chat.messages.map((message) =>
          message.id === action.messageId
            ? { ...message, content: `${message.content}${action.delta}` }
            : message
        )
      }));
    case "replaceMessage":
      return updateChat(state, action.chatId, (chat) => ({
        ...chat,
        updatedAt: new Date().toISOString(),
        messages: chat.messages.map((message) =>
          message.id === action.messageId
            ? { ...message, content: action.content, error: action.error }
            : message
        )
      }));
    case "updateSettings":
      return { ...state, settings: action.settings };
    default:
      return state;
  }
}

function updateChat(
  state: ChatState,
  chatId: string,
  updater: (chat: Chat) => Chat
): ChatState {
  return {
    ...state,
    chats: state.chats.map((chat) => (chat.id === chatId ? updater(chat) : chat))
  };
}

function loadInitialState(): ChatState {
  const fallbackChat = createEmptyChat(createId("chat"), new Date().toISOString());
  const fallback: ChatState = {
    activeChatId: fallbackChat.id,
    chats: [fallbackChat],
    settings: defaultSettings
  };

  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return fallback;
    }

    const parsed = JSON.parse(rawState) as ChatState;
    if (!parsed.chats?.length || !parsed.activeChatId) {
      return fallback;
    }

    return {
      activeChatId: parsed.activeChatId,
      chats: parsed.chats,
      settings: { ...defaultSettings, ...parsed.settings }
    };
  } catch {
    return fallback;
  }
}

function createEmptyChat(id: string, now: string): Chat {
  return {
    id,
    title: "Новый чат",
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

function createTitleFromMessage(content: string): string {
  const title = content.replace(/\s+/g, " ").trim();
  return title.length > 44 ? `${title.slice(0, 44)}...` : title || "Новый чат";
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
