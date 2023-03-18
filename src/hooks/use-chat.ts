import { useCallback, useEffect, useMemo } from "react";
import { useToast } from "../components/toast";
import { type ChatMap, type ChatMessage } from "../types";
import { getRandomChatId } from "../utils/chat";
import useLocalStorage from "./use-local-storage";

export function useChat() {
  const initialId = useMemo(() => getRandomChatId(), []);
  const [selectedId, setSelectedChat] = useLocalStorage<keyof ChatMap>(
    "chatmind.selected-chat-id",
    initialId
  );
  const [chatMap, setChatMap] = useLocalStorage<ChatMap>(
    "chatmind.chat-map",
    {}
  );
  const updateCurrentChat = useCallback(
    (
      index: number,
      getMessage: (message?: Partial<ChatMessage>) => Partial<ChatMessage>,
      title?: string
    ) => {
      setChatMap((prev) => {
        const messages = [...(prev[selectedId]?.messages || [])];
        // @ts-expect-error
        messages[index] = {
          ...messages[index],
          ...getMessage(prev[selectedId]?.messages[index]),
        };
        return {
          ...prev,
          [selectedId]: {
            id: selectedId,
            title:
              title ||
              prev[selectedId]?.title ||
              `Chat ${Object.keys(chatMap).length + 1}`,
            messages,
          },
        };
      });
    },
    [chatMap, selectedId, setChatMap]
  );
  const addChat = useCallback(
    (title?: string) => {
      const id = getRandomChatId();
      setChatMap((prev) => {
        const _title = title || `Chat ${Object.keys(prev).length + 1}`;
        return {
          ...prev,
          [id]: {
            id,
            title: _title,
            messages: [],
          },
        };
      });
      setSelectedChat(id);
    },
    [setChatMap, setSelectedChat]
  );
  const selectChat = useCallback(
    (id: string) => {
      setSelectedChat(id);
    },
    [setSelectedChat]
  );
  const resetMessages = useCallback(() => {
    // @ts-expect-error
    setChatMap((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        messages: [],
      },
    }));
  }, [selectedId, setChatMap]);
  const resetChatMap = useCallback(() => {
    setChatMap({});
  }, [setChatMap]);
  useEffect(() => {
    if (!selectedId) {
      addChat();
    }
  }, [selectedId, addChat]);

  const [apiKey, setApiKey] = useLocalStorage("chatmind.api-key", "");
  const { toast } = useToast();
  const updateApiKey = useCallback(
    (input: string) => {
      if (!input.startsWith("sk-")) {
        toast({
          variant: "destructive",
          title: "Invalid API Key",
          description: "Please double check your API Key.",
        });
        throw new Error(`Invalid API Key: ${input}`);
      }
      setApiKey(input);
      toast({
        title: "API key saved",
        description:
          "You API key has been saved in your browser, you can now chat with ChatGPT.",
      });
    },
    [setApiKey, toast]
  );
  return {
    selectedId,
    selectedChat: chatMap[selectedId],
    updateCurrentChat,
    resetMessages,
    resetChatMap,
    addChat,
    chatMap,
    selectChat,
    apiKey,
    updateApiKey,
  };
}
