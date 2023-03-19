import { isSSRMode } from "../utils/ssr";
import clsx from "clsx";
import { Command, useCommandState } from "cmdk";
import * as React from "react";

import { useKeyPressEvent } from "../../hooks/use-key-press-event";
import {
  CheckCircle,
  Clipboard,
  Copy,
  Eraser,
  Link,
  ListX,
  Plus,
  Search,
  Shield,
  Star,
  Trash,
} from "lucide-react";
import { useChat } from "../../hooks/use-chat";
import { Subtle } from "../typograph";
import { toast } from "../toast";
import { title } from "process";
import { ChatMap } from "../../types";
import { BaseButton } from '../button';

export type CommandMenuProps = {
  triggerClassName?: string;
};

export type Action = {
  name: string;
  icon: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
};

export function CommandMenu({
  triggerClassName,
}: CommandMenuProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  useKeyPressEvent(
    {
      targetKey: "k",
      cmdKey: true,
    },
    () => {
      setOpen(true);
    }
  );
  const {
    chatSize,
    resetChatMap,
    deleteCurrentChat,
    selectedChat,
    apiKey,
    saveApiKey,
    clearApiKey,
  } = useChat();
  const actions: Action[] = [
    ...(apiKey
      ? [
          {
            name: "Copy API key",
            icon: <Copy size={16} />,
            onSelect: async () => {
              await navigator.clipboard.writeText(apiKey);
              toast({
                title: "Copied API key to clipboard",
              });
            },
          },
          {
            name: "Clear API key",
            icon: <Trash size={16} />,
            onSelect: () => clearApiKey(),
            destructive: true,
          },
        ]
      : [
          {
            name: "Get your API key",
            icon: <Link size={16} />,
            onSelect: () => {
              window.open(
                "https://platform.openai.com/account/api-keys",
                "_blank"
              );
            },
          },
          {
            name: "Save API key from clipboard",
            icon: <Clipboard size={16} />,
            onSelect: async () => {
              const text = await navigator.clipboard.readText();
              saveApiKey(text);
            },
          },
        ]),
    ...(selectedChat?.title
      ? [
          {
            name: "Delete current chat",
            icon: <ListX size={16} />,
            onSelect: () => deleteCurrentChat(),
            destructive: true,
          },
        ]
      : []),
    ...(chatSize > 0
      ? [
          {
            name: "Delete all chats",
            icon: <Eraser size={16} />,
            onSelect: () => resetChatMap(),
            destructive: true,
          },
        ]
      : []),
  ];
  return (
    <>
      <BaseButton
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "flex items-center rounded-lg border border-gray-300 py-3 px-3.5 text-base text-gray-800 hover:border-gray-400",
          triggerClassName
        )}
      >
        <Search size={18} />
        <span className="ml-2 leading-none">Chats</span>
        <CommandShortCut />
      </BaseButton>
      <Command.Dialog
        loop
        open={open}
        onOpenChange={setOpen}
        label="Command menu"
        className={clsx(
          "fixed left-1/2 top-[35vh] z-20 w-[640px] -translate-x-1/2 rounded-lg shadow-lg",
          "bg-white/50 backdrop-blur-xl backdrop-saturate-150",
          "bg-opacity-90"
        )}
      >
        <Input />
        <div className="py-2 px-[18px]">
          <Subtle>{`Use arrow keys for navigation, enter key to confirm`}</Subtle>
        </div>
        <Command.List className="h-[30vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300/60">
          <Command.Empty className="py-3 px-[18px]">
            No results found.
          </Command.Empty>
          <ChatGroup onSelect={() => setOpen(false)} />
          <CommandMenu.Separator />
          <CommandMenu.Group heading="Actions">
            {actions.map((action) => (
              <Item
                onSelect={() => {
                  action.onSelect();
                  setOpen(false);
                }}
                key={action.name}
                destructive={action.destructive}
              >
                {action.icon}
                <span>{action.name}</span>
              </Item>
            ))}
          </CommandMenu.Group>
          <CommandMenu.Separator />
          <LinkGroup onSelect={() => setOpen(false)} />
        </Command.List>
      </Command.Dialog>
    </>
  );
}

type ChatGroupProps = { onSelect: () => void };
function ChatGroup({ onSelect }: ChatGroupProps) {
  const { chatMap, addChat, selectedId, apiKey, selectChat } = useChat();
  const search = useCommandState((state) => state.search);
  const msgMap: Record<keyof ChatMap, string> = React.useMemo(() => {
    return Object.entries(chatMap).reduce((prev, [chatId, chat]) => {
      const msg: string = chat.messages.reduce((prev, current) => {
        return `${prev} ${current.question.toLowerCase()} ${current.answer.toLowerCase()}`;
      }, "");
      return {
        ...prev,
        [chatId]: msg,
      };
    }, {});
  }, [chatMap]);

  return (
    <CommandMenu.Group heading="Switch chat">
      {Object.entries(chatMap).map(([chatId, chat]) => {
        const msg = msgMap[chatId];
        const foundIndex = msg?.indexOf(search) ?? -1;
        const foundContext = search
          ? msg?.slice(
              Math.max(0, foundIndex - 20),
              Math.min(foundIndex + 100, msg.length)
            )
          : "";
        return (
          <div key={chatId}>
            <CommandMenu.Item
              onSelect={() => {
                selectChat(chatId);
                onSelect();
              }}
              className="gap-2"
              value={`${title} ${msg}`}
            >
              {chatId === selectedId ? (
                <CheckCircle size={16} />
              ) : (
                <span className="inline-block w-4" />
              )}
              <span>{chat.title}</span>
            </CommandMenu.Item>
            {foundContext && (
              <p className="mx-2 flex gap-2 whitespace-nowrap px-3 py-1 text-xs text-gray-600 line-clamp-1">
                <strong className="mr-2">Found:</strong>
                <span>{foundContext}</span>
              </p>
            )}
          </div>
        );
      })}
      {apiKey && (
        <CommandMenu.Item
          key="new chat"
          onSelect={() => {
            addChat();
            onSelect();
          }}
        >
          <Plus size={20} />
          <span>New chat</span>
        </CommandMenu.Item>
      )}
    </CommandMenu.Group>
  );
}

const links = [
  {
    name: "GitHub repo",
    icon: <Star size={16} />,
    href: "https://github.com/devrsi0n/ChatMind",
  },
  {
    name: "Privacy policy",
    icon: <Shield size={16} />,
    href: "/privacy",
  },
];
function LinkGroup(props: ChatGroupProps) {
  return (
    <Group heading="Links">
      {links.map((link) => (
        <Item
          key={link.name}
          onSelect={() => {
            window.open(link.href, link.href.startsWith("/") ? "" : "_blank");
            props.onSelect();
          }}
        >
          {link.icon}
          <span>{link.name}</span>
        </Item>
      ))}
    </Group>
  );
}

export function CommandShortCut() {
  return (
    <span className="ml-4 flex gap-1.5 text-sm">
      <kbd className="rounded bg-gray-200 p-1 font-sans leading-none">
        {isSSRMode || navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
      </kbd>
      <kbd className="rounded bg-gray-200 py-1 px-1.5 font-sans leading-none">
        K
      </kbd>
    </span>
  );
}

CommandMenu.Group = Group;
CommandMenu.Item = Item;
CommandMenu.Separator = Separator;
CommandMenu.Loading = Loading;

function Group(props: React.ComponentProps<typeof Command.Group>): JSX.Element {
  return (
    <Command.Group
      {...props}
      className={clsx(
        "py-4 text-sm font-medium [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-[18px] [&_[cmdk-group-heading]]:text-gray-500",
        props.className
      )}
    />
  );
}

function Item({
  destructive,
  ...props
}: React.ComponentProps<typeof Command.Item> & {
  destructive?: boolean;
}): JSX.Element {
  return (
    <Command.Item
      {...props}
      className={clsx(
        "mx-2 flex items-center gap-2 rounded-lg py-3 px-[10px] text-sm font-medium transition hover:cursor-pointer",
        destructive
          ? "aria-selected:bg-red-200/50 aria-selected:text-red-700"
          : "aria-selected:bg-primary-200/40 aria-selected:text-primary-700",
        props.className
      )}
    />
  );
}

function Separator(
  props: React.ComponentProps<typeof Command.Separator>
): JSX.Element {
  return (
    <Command.Separator
      {...props}
      className={clsx("border-b border-gray-300", props.className)}
    />
  );
}

function Input(props: React.ComponentProps<typeof Command.Input>): JSX.Element {
  return (
    <div className="flex gap-2 border-b border-gray-300 p-4">
      <Search />
      <Command.Input
        placeholder="Search history"
        autoFocus
        {...props}
        className={clsx(
          "placeholder:text-gray-1000 w-full bg-transparent",
          props.className
        )}
      />
    </div>
  );
}

function Loading(
  props: React.ComponentProps<typeof Command.Loading>
): JSX.Element {
  return (
    <Command.Loading
      {...props}
      // @ts-ignore
      className={clsx(`py-3 px-[18px]`)}
    />
  );
}
