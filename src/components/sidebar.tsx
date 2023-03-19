import * as React from "react";
import { Logo } from "./logo";
import { CommandMenu } from "./command-menu";
import Link from "next/link";

export function Sidebar(): JSX.Element {
  return (
    <nav className="hidden h-full w-60 flex-col justify-between border-r py-3 sm:flex">
      <div className="flex flex-col gap-6">
        <header className="px-2.5">
          <Logo />
        </header>
        <CommandMenu triggerClassName="mx-2.5" />
      </div>
      <div className="mx-2.5 mb-5">
        <Link href="/privacy" className='underline'>Privacy policy</Link>
      </div>
    </nav>
  );
}
