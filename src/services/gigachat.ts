import type { ChatMessage } from "../types/message";
import type { ChatSettings } from "../types/settings";

type SendCompletionParams = {
  messages: ChatMessage[];
  settings: ChatSettings;
  signal: AbortSignal;
  onDelta: (delta: string) => void;
};

export async function sendChatCompletion({
  messages,
  settings,
  signal,
  onDelta
}: SendCompletionParams): Promise<string> {
  const payload = {
    model: settings.model,
    messages: [
      { role: "system", content: settings.systemPrompt },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content
      }))
    ],
    temperature: settings.temperature,
    top_p: settings.topP,
    max_tokens: settings.maxTokens,
    repetition_penalty: settings.repetitionPenalty,
    stream: settings.stream
  };

  const response = await fetch("/api/chat/completions", {
    body: JSON.stringify(payload),
    headers: {
      Accept: settings.stream ? "text/event-stream" : "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    signal
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const contentType = response.headers.get("content-type") || "";
  if (settings.stream && response.body && contentType.includes("text/event-stream")) {
    return readSseStream(response, onDelta);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  if (content) {
    onDelta(content);
  }
  return content;
}

async function readSseStream(
  response: Response,
  onDelta: (delta: string) => void
): Promise<string> {
  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const delta = parseSseEvent(event);
      if (!delta) {
        continue;
      }

      fullContent += delta;
      onDelta(delta);
    }
  }

  const tailDelta = parseSseEvent(buffer);
  if (tailDelta) {
    fullContent += tailDelta;
    onDelta(tailDelta);
  }

  return fullContent;
}

function parseSseEvent(event: string): string {
  const data = event
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.replace(/^data:\s?/, ""))
    .join("\n")
    .trim();

  if (!data || data === "[DONE]") {
    return "";
  }

  try {
    const parsed = JSON.parse(data);
    return (
      parsed.choices?.[0]?.delta?.content ||
      parsed.choices?.[0]?.message?.content ||
      ""
    );
  } catch {
    return "";
  }
}

async function readError(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) {
    return "GigaChat request failed";
  }

  try {
    const parsed = JSON.parse(text);
    return parsed.message || parsed.error || text;
  } catch {
    return text;
  }
}
