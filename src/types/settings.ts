export type ChatSettings = {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  repetitionPenalty: number;
  systemPrompt: string;
  stream: boolean;
};

export const defaultSettings: ChatSettings = {
  model: "GigaChat",
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  repetitionPenalty: 1,
  systemPrompt: "Ты полезный ассистент. Отвечай ясно и структурировано.",
  stream: true
};
