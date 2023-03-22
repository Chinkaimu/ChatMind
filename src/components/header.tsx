import * as React from "react";
import clsx from "clsx";
import { bluredBgStyles } from "./styles";
import { useChat } from "../hooks/use-chat";
import { Paragraph } from "./typograph";
import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import { Logo } from "./logo";
import { Link } from "./link";

export function ChatHeader(): JSX.Element {
  const { selectedChat } = useChat();
  return (
    <header className="absolute top-0 left-0 z-10 w-full border-b">
      <div className={clsx("mx-auto max-w-3xl py-4", bluredBgStyles)}>
        <div className="min-h-[24px]items-center flex justify-start">
          <Paragraph className="px-3">{selectedChat?.title}</Paragraph>
          {process.env.NODE_ENV === "development" && (
            <>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteHeader() {
  return (
    <header
      className={clsx(
        "absolute top-0 left-0 z-10 w-full border-b",
        bluredBgStyles
      )}
    >
      <div className={clsx("mx-auto max-w-3xl px-3 py-4")}>
        <div className="flex items-center justify-start gap-8">
          <Logo />
          <div className="-mt-1 flex items-center gap-4">
            <Link
              href={"https://app.chatmind.co"}
              className="text-xl font-medium no-underline hover:underline"
            >
              Chat
            </Link>
            <Link
              href={"https://github.com/devrsi0n/ChatMind"}
              className="text-xl font-medium no-underline hover:underline"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
