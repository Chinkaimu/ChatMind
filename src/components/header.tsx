import * as React from "react";
import clsx from "clsx";
import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import { Logo } from "./logo";

export type HeaderProps = {
  // children: React.ReactNode;
};

export function Header(props: HeaderProps): JSX.Element {
  return (
    <header className="absolute top-0 left-0 z-10 w-full border-b bg-white/75 py-4 backdrop-blur-md">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-end">
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
      </div>
    </header>
  );
}
