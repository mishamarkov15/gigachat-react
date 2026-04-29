import type { Chat, ChatMessage } from "../types/chat";

export const mockChats: Chat[] = [
  {
    id: "1",
    title: "План итогового проекта по GigaChat",
    lastMessageDate: "29.04.2026"
  },
  {
    id: "2",
    title: "Идеи для интерфейса чата и истории диалогов",
    lastMessageDate: "28.04.2026"
  },
  {
    id: "3",
    title: "Разбор промптов для учебного ассистента",
    lastMessageDate: "27.04.2026"
  },
  {
    id: "4",
    title: "Документация по авторизации",
    lastMessageDate: "25.04.2026"
  },
  {
    id: "5",
    title: "Черновик системного промпта для поддержки",
    lastMessageDate: "22.04.2026"
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    senderName: "Вы",
    variant: "user",
    text: "Помоги составить **структуру React-приложения** для чата."
  },
  {
    id: "m2",
    senderName: "GigaChat",
    variant: "assistant",
    text: "Начните с базовых зон:\n\n- Sidebar для списка диалогов\n- ChatWindow для сообщений\n- SettingsPanel для параметров модели"
  },
  {
    id: "m3",
    senderName: "Вы",
    variant: "user",
    text: "А как лучше показать markdown в сообщениях?"
  },
  {
    id: "m4",
    senderName: "GigaChat",
    variant: "assistant",
    text: "Для этого удобно подключить *react-markdown*. Например:\n\n```tsx\n<ReactMarkdown>{message.text}</ReactMarkdown>\n```"
  },
  {
    id: "m5",
    senderName: "Вы",
    variant: "user",
    text: "Добавь ещё состояния для ожидания ответа и пустого чата."
  },
  {
    id: "m6",
    senderName: "GigaChat",
    variant: "assistant",
    text: "Для ожидания ответа подойдёт `TypingIndicator`, а для пустого диалога — компонент `EmptyState` с понятным текстом."
  }
];
