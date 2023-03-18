export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

export type ChatMap = Record<string, Chat>;

export type ChatMessage = {
  question: string;
  answer: string;
  createdAt: number;
  error?: string;
};

export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  n?: number;
  max_tokens?: number;
  stream?: boolean;
}

export type Noop = () => void;

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: Usage;
  choices: Choice[];
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}

export interface Message {
  role: string;
  content: string;
}
