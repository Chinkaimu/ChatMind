import * as React from "react";
import clsx from "clsx";
import { bluredBgStyles } from "./styles";
import { useChat } from "../hooks/use-chat";
import { Paragraph } from "./typograph";
import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export function Header(): JSX.Element {
  const { selectedChat } = useChat();
  return (
    <header className="absolute top-0 left-0 z-10 w-full border-b">
      <div className={clsx("mx-auto max-w-3xl py-4", bluredBgStyles)}>
        <div className="flex min-h-[24px]items-center justify-start">
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
