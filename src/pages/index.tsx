import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Send } from "lucide-react";

import { useLocalStorage } from "usehooks-ts";
import {
  Header,
  Button,
  TextArea,
  BotMessage,
  UserMessage,
  TypographySubtle,
  useToast,
} from "../components";
import { type OpenAIStreamPayload, type Chat } from "../types";
import Link from "next/link";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

const Home: NextPage = () => {
  const { user } = useUser();
  const [input, setInput] = useLocalStorage("chatmind.input", "");
  const [chatList, setChatList] = useLocalStorage<Chat[]>(
    "chatmind.chat-list",
    []
  );
  const listRef = React.useRef<HTMLElement>(null);
  const scrollListIntoView = () => {
    listRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  };
  const setChat = (index: number, getChat: (chat: Chat) => Partial<Chat>) => {
    setChatList((prev) => {
      const newMessages = [...prev];
      if (newMessages[index]) {
        // @ts-ignore
        newMessages[index] = {
          ...newMessages[index],
          ...getChat(newMessages[index]!),
        };
      }
      return newMessages;
    });
  };
  const [apiKey, setApiKey] = useLocalStorage("chatmind.api-key", "");
  const { toast } = useToast();
  const handleClickSend = async () => {
    if (!apiKey) {
      if (!input || !input.startsWith("sk-")) {
        toast({
          variant: "destructive",
          title: "Invalid API Key",
          description: "Please double check your API Key.",
        });
        return;
      }
      setApiKey(input);
      setInput("");
      return;
    }
    const index = chatList.length;
    setInput("");
    const newChat: Chat = {
      question: input,
      answer: "",
      createdAt: Date.now(),
    };
    setChatList((prev) => [...prev, newChat]);
    scrollListIntoView();
    let data: ReadableStream<Uint8Array> | null;
    try {
      const messages = [...chatList.slice(-5), newChat]
        .map((chat) => {
          return [
            {
              role: "user",
              content: chat.question,
            },
            ...(chat.answer
              ? [
                  {
                    role: "assistant",
                    content: chat.answer,
                  },
                ]
              : []),
          ];
        })
        .flat();
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          method: "POST",
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are ChatGPT, a large language model trained by OpenAI.",
              },
              ...messages,
            ],
            stream: true,
            max_tokens: 500,
            // temperature: 0.7,
            // top_p: 1,
            // frequency_penalty: 0,
            // presence_penalty: 0,
            // n: 1,
          } as OpenAIStreamPayload),
        }
      );
      data = response.body;
      if (!response.ok || !data) {
        setChat(index, () => ({
          error:
            "Sorry, An error occurred. If this issue persists please contact Open AI through help center at help.openai.com.",
        }));
        return;
      }
    } catch (error) {
      setChat(index, () => ({
        error: "Sorry, Open AI is not available",
      }));
      return;
    }

    scrollListIntoView();
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let chunk = "";

    await reader.read().then(function processResult(result) {
      chunk += decoder.decode(result.value, { stream: true });

      const dataObjects = chunk.split("\n").filter(Boolean);
      // Process latest data object
      const latestData = dataObjects[dataObjects.length - 1]?.replace(
        /^data: /,
        ""
      );
      if (latestData === "[DONE]") {
        reader.cancel();
        return;
      }
      const jsonData = JSON.parse(latestData || "{}");
      if (jsonData.choices) {
        const content = jsonData.choices[0].delta.content;

        setChat(index, (chat: Chat) => ({
          answer: `${chat.answer}${content}`,
        }));
      }
      // Continue streaming responses
      reader.read().then(processResult);
    });
    scrollListIntoView();
  };

  return (
    <>
      <Head>
        <title>ChatMind app</title>
        <meta
          name="description"
          content="Enhancing your ChatGPT experience with ChatMind."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="mx-auto min-h-full max-w-3xl">
        <section className="flex flex-col gap-3 py-40" ref={listRef}>
          {chatList.map((msg) => (
            <div
              key={msg.createdAt + msg.answer}
              className="flex flex-col gap-3"
            >
              <UserMessage
                avatarUrl={user?.profileImageUrl}
                date={msg.createdAt}
                className="pl-12"
              >
                {msg.question}
              </UserMessage>
              <BotMessage className="pr-12" error={msg.error}>
                {msg.answer}
              </BotMessage>
            </div>
          ))}
        </section>
        <div className="fixed bottom-0 flex w-full  max-w-3xl flex-col gap-2 border-t bg-white/75 py-6 backdrop-blur-md">
          <div className="flex items-start gap-2">
            <TextArea
              name="chat"
              placeholder={
                apiKey
                  ? "Ask anything. (Press Shift + Enter to send)"
                  : "Enter your OpenAI API key to start."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (input && e.key === "Enter" && e.shiftKey) {
                  handleClickSend();
                }
              }}
              className="min-h-[4em]"
            />
            <Button
              variant="subtle"
              onClick={handleClickSend}
              disabled={!input}
            >
              {apiKey ? <Send size={20} /> : "Save"}
            </Button>
          </div>
          <div className="flex gap-2">
            {apiKey ? (
              <>
                <Button size="sm" variant="ghost" onClick={() => setApiKey("")}>
                  Reset API key
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setChatList([])}
                >
                  Clear chat history
                </Button>
              </>
            ) : (
              <>
                <TypographySubtle>
                  You key stays on your device, never sent to our servers.
                </TypographySubtle>
                <Link
                  href="https://platform.openai.com/account/api-keys"
                  className="text-sm text-primary-700 underline"
                  target="_blank"
                >
                  Get your API key on OpenAI dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
