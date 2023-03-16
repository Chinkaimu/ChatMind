import * as React from "react";
import clsx from "clsx";
import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export type HeaderProps = {
  // children: React.ReactNode;
};

export function Header(props: HeaderProps): JSX.Element {
  return (
    <header className="absolute top-0 left-0 z-10 w-full border-b">
      <div
        className={clsx("mx-auto max-w-3xl py-4", blurBackgroundStyles)}
      >
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

export const blurBackgroundStyles =
  "relative before:-z-10 before:absolute before:inset-0 before:bg-white/75 before:backdrop-blur-xl before:backdrop-saturate-150 before:dark:bg-opacity-70";
