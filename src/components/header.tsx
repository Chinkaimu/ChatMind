import * as React from "react";
import clsx from "clsx";
import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export type HeaderProps = {
  // children: React.ReactNode;
};

export function Header(props: HeaderProps): JSX.Element {
  return (
    <header className="fixed top-0 w-full bg-white/75 py-4 backdrop-blur-md z-10">
      <div className="mx-auto flex max-w-3xl items-center justify-end">
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton />
        </SignedIn>
        {/* Signed out users get sign in button */}
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
