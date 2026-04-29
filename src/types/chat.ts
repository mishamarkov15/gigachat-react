export type Chat = {
  id: string;
  title: string;
  lastMessageDate: string;
};

export type MessageVariant = "user" | "assistant";

export type ChatMessage = {
  id: string;
  senderName: string;
  variant: MessageVariant;
  text: string;
};
