import * as React from "react";
import { Logo } from "./logo";
import { CommandMenu } from "./command-menu";
import { Link } from "./link";

export function Sidebar(): JSX.Element {
  return (
    <nav className="hidden h-full w-60 flex-col justify-between border-r py-4 sm:flex">
      <div className="flex flex-col gap-6">
        <header className="px-2.5">
          <Logo />
        </header>
        <CommandMenu triggerClassName="mx-2.5" />
      </div>
      <div className="mx-2.5 mb-5 flex flex-col gap-2">
        <Link
          href="https://github.com/devrsi0n/ChatMind"
          className="text-gray-700 hover:text-gray-800"
        >
          GitHub repo
        </Link>
        <Link href="/privacy" className="text-gray-700 hover:text-gray-800">
          Privacy policy
        </Link>
      </div>
    </nav>
  );
}
