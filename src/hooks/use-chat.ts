import { useCallback, useMemo, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { type ChatMessage } from "../types";
import { getRandomChatId } from "../utils/chat";
import useLocalStorage from "./use-local-storage";

const CHAT_MESSAGES_KEY_PREFIX = "chatmind.chat-messages.";

export function useChatList() {
  const initialId = useMemo(() => getRandomChatId(), []);
  const [selectedChatId, setSelectedChat] = useLocalStorage(
    "chatmind.selected-chat-id",
    initialId
  );
  const [chatMessages, setChatMessages] = useLocalStorage<ChatMessage[]>(
    `${CHAT_MESSAGES_KEY_PREFIX}${selectedChatId}`,
    []
  );
  const [chatIdList, setChatIdList] = useState<string[]>(getChatIdList);
  const addChat = useCallback(() => {
    const newId = getRandomChatId();
    setSelectedChat(newId);
    setChatIdList((prev) => [...prev, newId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleStorageChange = (event: StorageEvent | CustomEvent) => {
    if ((event as StorageEvent)?.key?.startsWith(CHAT_MESSAGES_KEY_PREFIX)) {
      const key = (event as StorageEvent).key;
      if (key && !chatIdList.includes(key)) {
        setChatIdList((prev) => [...prev, key]);
      }
    }
  };
  useEventListener("storage", handleStorageChange);
  useEventListener("local-storage", handleStorageChange);
  return {
    selectedChatId,
    chatMessages,
    setChatMessages,
    addChat,
    chatIdList,
    selectChat: useCallback((id: string) => {
      setSelectedChat(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  };
}

function getChatIdList() {
  if (typeof window === "undefined") {
    return [];
  }
  const chatIdList = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CHAT_MESSAGES_KEY_PREFIX)) {
      chatIdList.push(key.replace(CHAT_MESSAGES_KEY_PREFIX, ""));
    }
  }
  return chatIdList;
}
