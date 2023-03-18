import * as React from "react";
import { Logo } from "./logo";
import { CommandMenu } from "./command-menu";


export function Sidebar(): JSX.Element {
  return (
    <nav className="h-full w-60 border-r py-3">
      <div className="flex flex-col gap-6">
        <header className="px-2.5">
          <Logo />
        </header>
        <CommandMenu triggerClassName="mx-2" />
      </div>
    </nav>
  );
}
