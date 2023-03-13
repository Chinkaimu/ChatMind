import * as React from "react";
import clsx from "clsx";
import { Logo } from "./logo";
import { Plus } from "lucide-react";
import { useChatList } from "../hooks/use-chat";

export function Sidebar(): JSX.Element {
  const { chatIdList, addChat, selectedChatId, selectChat } = useChatList();
  return (
    <nav className="h-full w-60 border-r py-3">
      <div className="flex flex-col gap-6">
        <header className="px-2.5">
          <Logo />
        </header>
        <ul className="flex flex-col gap-2">
          {chatIdList.map((chatId) => (
            <ConversationItem
              onClick={() => selectChat(chatId)}
              selected={chatId === selectedChatId}
              key={chatId}
            >
              {chatId}
            </ConversationItem>
          ))}
          <NewChat onClick={addChat} />
        </ul>
      </div>
    </nav>
  );
}

type ConversationItemProps = {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
};
function ConversationItem(props: ConversationItemProps) {
  return (
    <li
      className={clsx(itemStyles, props.selected && "bg-gray-600 text-white")}
    >
      <button
        onClick={props.onClick}
        type="button"
        className="w-full text-left"
      >
        {props.children}
      </button>
    </li>
  );
}

type NewChatProps = {
  onClick: () => void;
};
function NewChat(props: NewChatProps) {
  return (
    <li className={clsx(itemStyles, "border border-gray-500")}>
      <button
        onClick={props.onClick}
        type="button"
        className={clsx("flex w-full items-center gap-1 text-left")}
      >
        <Plus size={20} />
        <span>New chat</span>
      </button>
    </li>
  );
}

const itemStyles =
  "mx-2 rounded px-2.5 py-1.5 hover:bg-gray-500 hover:text-white transition";
