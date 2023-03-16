export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export type ChatMap = Record<string, Chat>;

export type ChatMessage = {
  question: string;
  answer: string;
  createdAt: number;
  error?: string;
};

export type ChatGPTAgent = "user" | "system" | 'assistant';

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export type Noop = () => void;