import * as React from "react";
import clsx from "clsx";
import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import { Logo } from "./logo";

export type HeaderProps = {
  // children: React.ReactNode;
};

export function Header(props: HeaderProps): JSX.Element {
  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white/75 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Logo />
        <div>
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton />
          </SignedIn>
          {/* Signed out users get sign in button */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
