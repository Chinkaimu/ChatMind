import * as React from "react";
import clsx from "clsx";
import { Logo } from "./logo";
import { Eraser, Plus } from "lucide-react";
import { useChatMap } from "../hooks/use-chat";
import { CommandMenu } from "./command-menu";

export type Action = {
  name: string;
  icon: React.ReactNode;
  onSelect: () => void;
};
export type SidebarProps = {
  actions: Action[];
};

export function Sidebar(props: SidebarProps): JSX.Element {
  const { chatMap, addChat, selectChat, resetChatMap } = useChatMap();
  return (
    <nav className="h-full w-60 border-r py-3">
      <div className="flex flex-col gap-6">
        <header className="px-2.5">
          <Logo />
        </header>
        <CommandMenu triggerClassName="mx-2">
          <CommandMenu.Group heading="Chats">
            {Object.entries(chatMap).map(([chatId, chat]) => (
              <CommandMenu.Item
                onSelect={() => selectChat(chatId)}
                key={chatId}
              >
                {chat.title}
              </CommandMenu.Item>
            ))}
            <CommandMenu.Item
              onSelect={() =>
                addChat(`Title ${Object.keys(chatMap).length + 1}`)
              }
            >
              <Plus size={20} />
              <span>New chat</span>
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Separator />
          <CommandMenu.Group heading="Actions">
            {props.actions.map((action) => (
              <CommandMenu.Item onSelect={action.onSelect} key={action.name}>
                {action.icon}
                <span>{action.name}</span>
              </CommandMenu.Item>
            ))}
            <CommandMenu.Item onSelect={resetChatMap}>
              <Eraser size={18} />
              <span>Clear all chats</span>
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu>
      </div>
    </nav>
  );
}
