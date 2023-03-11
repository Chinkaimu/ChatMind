import * as React from "react";
import clsx from "clsx";
import { Avatar, AvatarImage } from "./avatar";
import { TypographyP, TypographySubtle } from "./typograph";
import { MessageSquare } from "lucide-react";

export type UserMessageProps = {
  children: React.ReactNode;
  avatarUrl?: string | null;
  date?: string;
};

export function UserMessage(props: UserMessageProps): JSX.Element {
  return (
    <section className="flex justify-end gap-3 w-full">
      <div>
        <TypographyP className="rounded-l-lg rounded-b-lg border bg-primary-600 px-3.5 py-2.5 text-white">
          {props.children}
        </TypographyP>
        <TypographySubtle>{props.date}</TypographySubtle>
      </div>
      <Avatar>
        <AvatarImage src={props.avatarUrl || ""} />
      </Avatar>
    </section>
  );
}

type BotMessageProps = {
  children: React.ReactNode;
};
export function BotMessage(props: BotMessageProps) {
  return (
    <section className="flex gap-3 w-full">
      <Avatar className="">
        <MessageSquare size={24} />
      </Avatar>
      <div>
        <TypographyP className="whitespace-pre-wrap rounded-r-lg rounded-b-lg border bg-gray-100 px-3.5 py-2.5">
          {props.children}
        </TypographyP>
      </div>
    </section>
  );
}
