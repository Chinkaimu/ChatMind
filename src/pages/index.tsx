import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Send } from "lucide-react";

import { useLocalStorage } from "usehooks-ts";
import { Header, Button, TextArea, BotMessage, UserMessage } from "../components";

type Chat = {
  question: string;
  answer: string;
  createdAt: number;
  error?: string;
};

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
  const handleClickSend = async () => {
    const index = chatList.length;
    setInput("");
    setChatList((prev) => [
      ...prev,
      {
        question: input,
        answer: "",
        createdAt: Date.now(),
      },
    ]);
    scrollListIntoView();
    let data: ReadableStream<Uint8Array> | null;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

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

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    scrollListIntoView();
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setChat(index, (chat: Chat) => ({
        answer: `${chat.answer}${chunkValue}`,
      }));
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
              <BotMessage className="pr-12">
                {msg.answer || msg.error}
              </BotMessage>
            </div>
          ))}
        </section>
        <div className="fixed bottom-0 flex w-full max-w-3xl items-start gap-2 border-t bg-white/75 py-6 backdrop-blur-md">
          <TextArea
            name="chat"
            placeholder="Ask anything. (Press Shift + Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                handleClickSend();
              }
            }}
            className="min-h-[4em]"
          />
          <Button size="sm" variant="ghost" onClick={handleClickSend}>
            <Send size={22} />
          </Button>
        </div>
      </main>
    </>
  );
};

export default Home;
