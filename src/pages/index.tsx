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
import { type OpenAIStreamPayload, type Chat, ChatGPTMessage } from "../types";
import Link from "next/link";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { chatGPTStream } from "../utils/stream";

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
    let data: ReadableStream<any> | null;
    try {
      const messages: ChatGPTMessage[] = [...chatList.slice(-5), newChat]
        .map((chat) => {
          return [
            {
              role: "user",
              content: chat.question,
            } as const,
            ...(chat.answer
              ? [
                  {
                    role: "assistant",
                    content: chat.answer,
                  } as const,
                ]
              : []),
          ];
        })
        .flat();
      data = await chatGPTStream(apiKey, {
        messages: [
          {
            role: "system",
            content:
              "You are ChatGPT, a large language model trained by OpenAI.",
          },
          ...messages,
        ],
      });
    } catch (err) {
      if (err instanceof Error) {
        setChat(index, () => ({
          // @ts-expect-error
          error: err.message || "Sorry, Open AI is not available",
        }));
      }
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setChat(index, (chat: Chat) => ({
        answer: `${chat.answer}${chunkValue}`,
      }));
      scrollListIntoView();
    }
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
                  e.preventDefault();
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
