import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Send } from "lucide-react";

import { Button } from "../components/button";
import { Input } from "../components/input";
import { BotMessage, UserMessage } from "../components/message";

type Chat = {
  question: string;
  answer: string;
  createdAt: Date;
};

const Home: NextPage = () => {
  const { user } = useUser();
  const [input, setInput] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Chat[]>([]);

  const handleClickSend = async () => {
    setLoading(true);
    const index = messages.length;
    setMessages((prev) => [
      ...prev,
      {
        question: input,
        answer: "",
        createdAt: new Date(),
      },
    ]);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setMessages((prev) => {
        const newMessages = [...prev];
        const msg = newMessages[index];
        console.log({
          chunkValue,
          answer: msg?.answer,
        });
        if (msg) {
          msg.answer += chunkValue;
        } else {
          throw new Error("Message not found");
        }
        return newMessages;
      });
    }

    // scrollToBios();
    setLoading(false);
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
      <main className="mx-auto min-h-full max-w-3xl">
        <section className="mb-8 flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.createdAt.toISOString()}
              className="flex flex-col gap-2"
            >
              <UserMessage avatarUrl={user?.profileImageUrl}>
                {msg.question}
              </UserMessage>
              <BotMessage>{msg.answer}</BotMessage>
            </div>
          ))}
        </section>
        <div className="flex items-center gap-2">
          <Input
            name="chat"
            placeholder="Ask anything. (Press Shift + Enter to send))"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                handleClickSend();
              }
            }}
            disabled={loading}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClickSend}
            disabled={loading}
          >
            <Send size={20} />
          </Button>
        </div>
      </main>
    </>
  );
};

export default Home;
