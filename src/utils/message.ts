import { ChatMessage, ChatGPTMessage } from '../types';

const MAX_TOKEN = 4097;

export function getChatMessages(chats: ChatMessage[]): ChatGPTMessage[] {
  const messages: ChatGPTMessage[] = [];
  for (let i = 0; i < chats.length; i++) {

  }
  return messages;
}

