import type { Chat } from "../types/chat";
import type { ChatMessage } from "../types/message";

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
    role: "user",
    content: "Помоги составить **структуру React-приложения** для чата.",
    timestamp: "10:12"
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "Начните с базовых зон:\n\n- Sidebar для списка диалогов\n- ChatWindow для сообщений\n- SettingsPanel для параметров модели",
    timestamp: "10:13"
  },
  {
    id: "m3",
    role: "user",
    content: "А как лучше показать markdown в сообщениях?",
    timestamp: "10:15"
  },
  {
    id: "m4",
    role: "assistant",
    content:
      "Для этого удобно подключить *react-markdown*. Например:\n\n```tsx\n<ReactMarkdown>{message.content}</ReactMarkdown>\n```",
    timestamp: "10:16"
  },
  {
    id: "m5",
    role: "user",
    content: "Добавь ещё состояния для ожидания ответа и пустого чата.",
    timestamp: "10:18"
  },
  {
    id: "m6",
    role: "assistant",
    content:
      "Для ожидания ответа подойдёт `TypingIndicator`, а для пустого диалога — компонент `EmptyState` с понятным текстом.",
    timestamp: "10:19"
  }
];

export const mockAssistantReplies = [
  "Принял. Для следующего шага можно вынести состояние сообщений в `ChatWindow` и передавать список вниз через props.",
  "Готово: пользовательское сообщение добавляется сразу, а ответ ассистента можно симулировать через `setTimeout`.",
  "Хорошая идея. Ещё стоит блокировать поле ввода на время генерации, чтобы не создавать несколько параллельных мок-ответов.",
  "Для автоскролла добавьте пустой `div` в конце списка и вызывайте `scrollIntoView` после изменения массива сообщений."
];
