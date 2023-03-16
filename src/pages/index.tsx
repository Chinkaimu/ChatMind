import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { ListX, Send, Trash } from "lucide-react";

import { useLocalStorage } from "../hooks/use-local-storage";
import {
  Header,
  Button,
  TextArea,
  BotMessage,
  UserMessage,
  useToast,
  Sidebar,
} from "../components";
import { type ChatMessage, type ChatGPTMessage } from "../types";
import Link from "next/link";
import { useChatMap } from "../hooks/use-chat";
import { useIsMounted } from "usehooks-ts";

const Home: NextPage = () => {
  const { user } = useUser();
  const [input, setInput] = useLocalStorage("chatmind.input", "");
  const listRef = React.useRef<HTMLElement>(null);
  const scrollListIntoView = () => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  };
  const { selectedChat, updateCurrentChat, resetMessages } = useChatMap();
  const [apiKey, setApiKey] = useLocalStorage("chatmind.api-key", "");
  const { toast } = useToast();
  const isMounted = useIsMounted();
  const selectedMessages = selectedChat?.messages || [];
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
      toast({
        title: "API key saved",
        description:
          "You API key has been saved in your browser, you can now chat with ChatGPT.",
      });
      return;
    }
    const index = selectedMessages.length;
    setInput("");
    const newMessage: ChatMessage = {
      question: input,
      answer: "",
      createdAt: Date.now(),
    };
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
      console.log("Chat request failed", err);
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

  // const clerk = useClerk();
  return (
    <>
      <Head>
        <title>ChatMind app</title>
        <meta
          name="description"
          content="Enhancing your ChatGPT experience with ChatMind."
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className="flex h-full">
        <Sidebar
          actions={[
            {
              name: "Reset API key",
              icon: <Trash size={16} />,
              onSelect: () => setApiKey(""),
            },
            {
              name: "Clear this chat",
              icon: <ListX size={16} />,
              onSelect: () => resetMessages(),
            },
          ]}
        />
        <div className="relative w-full">
          <Header />
          <main className="mx-auto h-[calc(100%-54px)] max-w-3xl px-3">
            <section
              className="flex h-full flex-col gap-6 overflow-y-auto py-40"
              ref={listRef}
            >
              <div className="flex flex-col gap-2">
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
                      className="text-sm text-gray-700 underline"
                      target="_blank"
                    >
                      Get your API key on OpenAI dashboard
                    </Link>
                  </div>
                )}
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
            <div className="fixed bottom-0 flex w-full  max-w-3xl flex-col gap-2 border-t bg-white/75 py-6 backdrop-blur-xl backdrop-saturate-150">
              <div className="flex items-start gap-2">
                <TextArea
                  name="chat"
                  placeholder={
                    apiKey
                      ? "Ask anything. (Press Shift + Enter to insert a new line)"
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
                  className="min-h-[6em]"
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
                {apiKey && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setApiKey("")}
                    >
                      Reset API key
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resetMessages()}
                    >
                      Clear chat history
                    </Button>
                    {/* {!isSignedIn && (
                      <div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => clerk.openSignIn({})}
                        >
                          Sign in
                        </Button>
                        <TypographySubtle>
                          to save your history cross devices
                        </TypographySubtle>
                      </div>
                    )} */}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
