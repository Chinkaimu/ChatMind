import * as React from "react";
import clsx from "clsx";
import { Logo } from "./logo";

export type SidebarProps = {};

export function Sidebar(props: SidebarProps): JSX.Element {
  return (
    <nav className="h-full w-60 border-r py-3">
      <div className="flex flex-col gap-3">
        <header className="px-2.5">
          <Logo />
        </header>
        <ul>
          <ConversationItem selected>Chat</ConversationItem>
        </ul>
      </div>
    </nav>
  );
}

type ConversationItemProps = {
  children: React.ReactNode;
  selected?: boolean;
};
function ConversationItem(props: ConversationItemProps) {
  return (
    <li
      className={clsx(
        "mx-2 rounded px-2.5 py-1.5",
        props.selected && "bg-primary-600 text-white"
      )}
    >
      {props.children}
    </li>
  );
}
