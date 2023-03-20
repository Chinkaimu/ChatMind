import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Send } from "lucide-react";

import { useLocalStorage } from "../hooks/use-local-storage";
import {
  Header,
  Button,
  TextArea,
  BotMessage,
  UserMessage,
  Sidebar,
  Subtle,
  Paragraph,
} from "../components";
import { type ChatMessage, type ChatGPTMessage } from "../types";
import { useChat } from "../hooks/use-chat";
import { useIsMounted } from "usehooks-ts";
import { CommandShortCut } from "../components/command-menu";
import { useUser } from "@clerk/nextjs";
import { Banner } from "../components/banner";
import { isMobile } from "../components/utils/is-mobile";
import { Link } from '../components/link';

const Home: NextPage = () => {
  const [input, setInput] = useLocalStorage("chatmind.input", "");
  const listRef = React.useRef<HTMLElement>(null);
  const scrollListIntoView = () => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  };
  const { selectedChat, updateCurrentChat, apiKey, saveApiKey } = useChat();

  const isMounted = useIsMounted();
  const selectedMessages = selectedChat?.messages || [];
  const handleClickSend = async () => {
    if (!apiKey) {
      saveApiKey(input);
      setInput("");
      return;
    }
    const index = selectedMessages.length;
    const newMessage: ChatMessage = {
      question: input,
      answer: "",
      createdAt: Date.now(),
    };
    setInput("");
    updateCurrentChat(index, () => newMessage);
    let data: ReadableStream<Uint8Array>;
    try {
      const messages: ChatGPTMessage[] = [
        ...selectedMessages.slice(-5),
        newMessage,
      ]
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
      let isLoaded = false;
      setTimeout(() => {
        if (!isLoaded && isMounted()) {
          updateCurrentChat(index, () => ({
            error: "OpenAI request is time-out",
          }));
        }
      }, 10_000);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are ChatGPT, a large language model trained by OpenAI.",
            },
            ...messages,
          ],
          apiKey,
        }),
      });
      isLoaded = true;
      if (!response.body) {
        throw new Error("Sorry, Open AI is not available");
      }
      data = response.body;
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        scrollListIntoView();
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateCurrentChat(index, (message) => ({
          answer: `${message?.answer}${chunkValue}`,
        }));
      }
    } catch (err) {
      console.error("Chat request failed", err);
      if (err instanceof Error) {
        updateCurrentChat(index, () => ({
          // @ts-expect-error
          error: err.message || "Sorry, Open AI is not available",
        }));
      }
      return;
    }
  };
  React.useEffect(() => {
    scrollListIntoView();
  }, [selectedMessages.length]);

  const { user } = useUser();
  return (
    <>
      <div className="flex h-full">
        <Sidebar />
        <div className="relative w-full overflow-y-hidden">
          <Header />
          <main className="mx-auto h-[calc(100%-54px)] max-w-3xl px-3">
            <section
              className="flex h-full flex-col gap-6 overflow-y-auto py-40"
              ref={listRef}
            >
              <div className="mb-10 flex flex-col gap-2 sm:mb-20">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  👋 Welcome to ChatMind
                </h1>
                {!apiKey && (
                  <div className="flex flex-col">
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      Paste your OpenAI API key to start chatting with ChatGPT.
                    </p>
                    <Link
                      href="https://platform.openai.com/account/api-keys"
                      className="text-sm text-gray-700 "
                      target="_blank"
                    >
                      Get your API key on OpenAI dashboard
                    </Link>
                  </div>
                )}
                <Paragraph className="!mt-3">
                  Give us a ⭐ on{" "}
                  <a
                    href="https://github.com/devrsi0n/ChatMind"
                    className="underline"
                  >
                    GitHub
                  </a>{" "}
                  , it will help us a lot! Thanks for your support! ❤️
                </Paragraph>
              </div>
              {selectedMessages.map((msg) => (
                <div
                  key={msg.createdAt + msg.answer}
                  className="flex flex-col gap-3"
                >
                  <UserMessage
                    avatarUrl={user?.profileImageUrl}
                    date={msg.createdAt}
                    className="pl-12 pr-1"
                  >
                    {msg.question}
                  </UserMessage>
                  <BotMessage className="pr-12" error={msg.error}>
                    {msg.answer}
                  </BotMessage>
                </div>
              ))}
            </section>
            <div className="sticky bottom-0 w-full max-w-3xl bg-white/75 backdrop-blur-xl backdrop-saturate-150">
              <Banner />
              <div className="mt-2 flex flex-col gap-2 border-t py-6">
                <div className="flex items-start gap-2">
                  <TextArea
                    name="chat"
                    placeholder={
                      apiKey
                        ? `Ask anything.${
                            !isMobile()
                              ? " (Press Shift + Enter to insert a new line)"
                              : ""
                          }`
                        : "Enter your OpenAI API key to start."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (input && e.key === "Enter" && !e.shiftKey) {
                        handleClickSend();
                        e.preventDefault();
                      } else if (e.key === "Enter" && e.shiftKey) {
                        setInput((prev) => `${prev}\n`);
                      }
                    }}
                    enterKeyHint="send"
                    className="min-h-[6em]"
                  />
                  <Button
                    variant="subtle"
                    onClick={handleClickSend}
                    disabled={!input}
                    className="hidden sm:flex"
                  >
                    {apiKey ? <Send size={20} /> : "Save"}
                  </Button>
                </div>
                <div className="hidden gap-2 py-1 sm:flex">
                  <Subtle className="flex items-center gap-1">
                    <span>Want a new chat? Try</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        dispatchEvent(
                          new KeyboardEvent("keydown", {
                            key: "k",
                            metaKey: true,
                          })
                        );
                      }}
                    >
                      <span>Command menu</span>
                      <CommandShortCut />
                    </Button>
                  </Subtle>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
