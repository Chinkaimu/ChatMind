import { useCallback, useMemo } from "react";
import { type ChatMap, type ChatMessage } from "../types";
import { getRandomChatId } from "../utils/chat";
import useLocalStorage from "./use-local-storage";

export function useChatMap() {
  const initialId = useMemo(() => getRandomChatId(), []);
  const [selectedId, setSelectedChat] = useLocalStorage(
    "chatmind.selected-chat-id",
    initialId
  );
  const [chatMap, setChatMap] = useLocalStorage<ChatMap>(
    "chatmind.chat-map",
    {}
  );
  const setChat = useCallback(
    (messages: ChatMessage[], title?: string) => {
      setChatMap((prev) => ({
        ...prev,
        [selectedId]: {
          id: selectedId,
          title: title || prev[selectedId]?.title || "Untitled",
          messages,
        },
      }));
    },
    [selectedId, setChatMap]
  );
  return {
    selectedId,
    selectedChat: chatMap[selectedId],
    setChat,
    addChat: useCallback(
      (title: string) => {
        const id = getRandomChatId();
        setChatMap((prev) => ({
          ...prev,
          [id]: {
            id,
            title,
            messages: [],
          },
        }));
        setSelectedChat(id);
      },
      [setChatMap, setSelectedChat]
    ),
    chatMap,
    selectChat: useCallback((id: string) => {
      setSelectedChat(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  };
}
