import { useCallback, useEffect, useMemo } from "react";
import { useToast } from "../components/toast";
import { type ChatMap, type ChatMessage } from "../types";
import { api } from "../utils/api";
import { getRandomChatId } from "../utils/chat";
import useLocalStorage from "./use-local-storage";

export function useChat() {
  const initialId = useMemo(() => getRandomChatId(), []);
  const [selectedId, setSelectedChat] = useLocalStorage<keyof ChatMap | null>(
    "chatmind.selected-chat-id",
    initialId
  );
  const [chatMap, setChatMap] = useLocalStorage<ChatMap>(
    "chatmind.chat-map",
    {}
  );
  const chatSize = Object.keys(chatMap).length;
  const updateCurrentChat = useCallback(
    (
      index: number,
      getMessage: (message?: Partial<ChatMessage>) => Partial<ChatMessage>,
      title?: string
    ) => {
      setChatMap((prev) => {
        if (!selectedId) {
          throw new Error(`No chat selected when updating current chat`);
        }
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
            title: title || prev[selectedId]?.title || `Chat ${chatSize + 1}`,
            messages,
          },
        };
      });
    },
    [chatSize, selectedId, setChatMap]
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
  const clearCurrentChat = useCallback(() => {
    if (!selectedId) {
      throw new Error(`No chat selected when resetting messages`);
    }
    let newId = null;
    // @ts-ignore
    setChatMap((prev) => {
      const map = { ...prev };
      if (!(selectedId in map)) {
        throw new Error(`Selected id ${selectedId} is not found in chat map`);
      }
      delete map[selectedId];
      newId = Object.keys(map)[0];
      return prev;
    });
    setSelectedChat(newId);
  }, [selectedId, setChatMap, setSelectedChat]);
  const clearChatMap = useCallback(() => {
    setChatMap({});
    setSelectedChat(null);
  }, [setChatMap, setSelectedChat]);
  useEffect(() => {
    if (!selectedId) {
      addChat();
    }
  }, [selectedId, addChat]);

  const [apiKey, setApiKey] = useLocalStorage<string | null>(
    "chatmind.api-key",
    ""
  );
  const { toast } = useToast();
  const saveApiKey = useCallback(
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
      if (chatSize === 0) {
        addChat();
      }
    },
    [addChat, chatSize, setApiKey, toast]
  );
  const clearApiKey = useCallback(() => {
    setApiKey(null);
  }, [setApiKey]);
  const selectedChat =
    selectedId && selectedId in chatMap ? chatMap[selectedId] : null;
  api.chat.summary.useQuery(
    {
      apiKey: apiKey!,
      messages: selectedChat?.messages!,
    },
    {
      // Generate once for each chat
      enabled: !!(
        apiKey &&
        (selectedChat?.messages.length || 0 >= 4) &&
        !/^Chat \d+$/gi.test(selectedChat?.title || '')
      ),
      onSuccess(data) {
        if (!data) return;
        // @ts-ignore
        setChatMap((prev) => {
          if (!(selectedId && selectedId in prev)) {
            throw new Error(
              `Selected id ${selectedId} is not found in chat map`
            );
          }
          return {
            ...prev,
            [selectedId]: {
              ...prev[selectedId],
              title: data,
            },
          };
        });
      },
    }
  );
  return {
    selectedId,
    selectedChat,
    updateCurrentChat,
    clearCurrentChat,
    clearChatMap,
    addChat,
    chatMap,
    chatSize,
    selectChat,
    apiKey,
    saveApiKey,
    clearApiKey,
  };
}
