import * as React from "react";
import clsx from "clsx";
import { Avatar, AvatarImage } from "./avatar";
import { TypographyP, TypographySubtle } from "./typograph";
import { MessageSquare } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Spinner } from "./spinner";

dayjs.extend(relativeTime);

export type UserMessageProps = {
  children: React.ReactNode;
  avatarUrl?: string | null;
  date: number;
  className?: string;
};
dayjs.extend(relativeTime);
export const UserMessage = React.memo(function UserMessageInner(
  props: UserMessageProps
): JSX.Element {
  return (
    <section className={clsx("flex w-full justify-end gap-3", props.className)}>
      <div className="flex flex-col items-end">
        <TypographyP className="rounded-l-lg rounded-b-lg border bg-primary-600 px-3.5 py-2.5 text-white">
          {props.children}
        </TypographyP>
        <TypographySubtle>{dayjs(props.date).fromNow()}</TypographySubtle>
      </div>
      <Avatar>
        <AvatarImage src={props.avatarUrl || ""} />
      </Avatar>
    </section>
  );
});

type BotMessageProps = {
  children: React.ReactNode;
  className?: string;
  error?: string;
};
export function BotMessage(props: BotMessageProps) {
  return (
    <section className={clsx("flex w-full gap-3", props.className)}>
      <Avatar className="">
        <MessageSquare size={24} />
      </Avatar>
      <div className="">
        {props.error ? (
          <p className="px-3.5 py-2.5 bg-red-100 text-red-600 rounded-r-lg rounded-b-lg border border-red-600" role="alert">
            {props.error}
          </p>
        ) : (
          <TypographyP className="whitespace-pre-wrap rounded-r-lg rounded-b-lg border bg-gray-100 px-3.5 py-2.5">
            {props.children || <Spinner />}
          </TypographyP>
        )}
      </div>
    </section>
  );
}
