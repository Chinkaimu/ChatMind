import { isSSRMode } from "../../utils/ssr";
import clsx from "clsx";
import { Command } from "cmdk";
import { useRouter } from "next/router";
import * as React from "react";

import { useKeyPressEvent } from "../../hooks/use-key-press-event";
import { Search } from "lucide-react";

export type CommandMenuProps = {
  children: React.ReactNode;
  triggerClassName?: string;
};

export function CommandMenu({
  children,
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
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "flex items-center rounded-lg border border-gray-300 py-3 px-3.5 text-base text-gray-800 hover:border-gray-400",
          triggerClassName
        )}
      >
        <Search size={18} />
        <span className="ml-2 leading-none">Chats</span>
        <span className="ml-4 flex gap-1.5 text-sm">
          <kbd className="rounded bg-gray-200 p-1 font-sans leading-none">
            {isSSRMode || navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
          </kbd>
          <kbd className="rounded bg-gray-200 py-1 px-1.5 font-sans leading-none">
            K
          </kbd>
        </span>
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command menu"
        className={clsx(
          "fixed left-1/2 top-[35vh] z-20 w-[640px] -translate-x-1/2 rounded-lg shadow-lg",
          "bg-white/75 backdrop-blur-xl backdrop-saturate-150 ",
          "bg-opacity-90"
        )}
      >
        <Input />
        <Command.List className="h-[30vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/60">
          <Command.Empty className="py-3 px-[18px]">
            No results found.
          </Command.Empty>
          {children}
        </Command.List>
      </Command.Dialog>
    </>
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
  href,
  onSelect,
  destructive,
  ...props
}: React.ComponentProps<typeof Command.Item> & {
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
}): JSX.Element {
  const router = useRouter();
  return (
    <Command.Item
      {...props}
      className={clsx(
        "mx-2 flex items-center gap-2 rounded-lg py-3 px-[10px] transition text-base hover:cursor-pointer",
        destructive
          ? "aria-selected:bg-red-200/50 aria-selected:text-red-700"
          : "aria-selected:bg-primary-200/40 aria-selected:text-primary-700",
        props.className
      )}
      onSelect={() => {
        if (href) {
          router.push(href);
        } else {
          onSelect?.();
        }
      }}
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
        placeholder="Search"
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
