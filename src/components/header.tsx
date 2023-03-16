import * as React from "react";
import clsx from "clsx";
import { bluredBgStyles } from "./styles";
// import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export function Header(): JSX.Element {
  return (
    <header className="absolute top-0 left-0 z-10 w-full border-b">
      <div className={clsx("mx-auto max-w-3xl py-4", bluredBgStyles)}>
        <div className="flex min-h-[24px] items-center justify-end">
          <div>
            {/* <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut> */}
          </div>
        </div>
      </div>
    </header>
  );
}
