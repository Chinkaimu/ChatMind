import * as React from "react";
import clsx from "clsx";
import { Avatar, AvatarImage } from "./avatar";
import { TypographyP, TypographySubtle } from "./typograph";
import { MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
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
  children: string;
  className?: string;
  error?: string;
};
export function BotMessage(props: BotMessageProps) {
  return (
    <section className={clsx("flex w-full gap-3", props.className)}>
      <Avatar className="">
        <BotImage />
      </Avatar>
      <div className="">
        {props.error ? (
          <p
            className="rounded-r-lg rounded-b-lg border border-red-600 bg-red-100 px-3.5 py-2.5 text-red-600"
            role="alert"
          >
            {props.error}
          </p>
        ) : (
          <div className="whitespace-pre-wrap rounded-r-lg rounded-b-lg border bg-gray-100 px-3.5 py-2.5">
            {props.children ? (
              <ReactMarkdown>{props.children}</ReactMarkdown>
            ) : (
              <Spinner />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function BotImage() {
  return (
    <svg
      // width="60"
      // height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="30" fill="#101828" />
      <path
        d="M17.03 42.27C15.39 42.27 13.9 42.02 12.56 41.52C11.22 41.02 10.06 40.29 9.08 39.33C8.1 38.37 7.35 37.2 6.83 35.82C6.31 34.42 6.05 32.83 6.05 31.05C6.05 29.29 6.31 27.72 6.83 26.34C7.35 24.94 8.1 23.76 9.08 22.8C10.06 21.84 11.22 21.11 12.56 20.61C13.9 20.11 15.39 19.86 17.03 19.86C18.91 19.86 20.58 20.19 22.04 20.85C23.5 21.49 24.68 22.39 25.58 23.55C26.48 24.71 27.03 26.08 27.23 27.66H22.49C22.31 26.9 21.97 26.24 21.47 25.68C20.97 25.1 20.34 24.65 19.58 24.33C18.84 24.01 17.99 23.85 17.03 23.85C15.77 23.85 14.68 24.12 13.76 24.66C12.84 25.18 12.13 25.98 11.63 27.06C11.13 28.12 10.88 29.45 10.88 31.05C10.88 32.27 11.02 33.33 11.3 34.23C11.6 35.13 12.01 35.88 12.53 36.48C13.07 37.08 13.72 37.53 14.48 37.83C15.24 38.13 16.09 38.28 17.03 38.28C17.97 38.28 18.82 38.12 19.58 37.8C20.34 37.48 20.97 37.03 21.47 36.45C21.99 35.87 22.33 35.2 22.49 34.44H27.23C27.05 36.02 26.5 37.4 25.58 38.58C24.66 39.74 23.47 40.65 22.01 41.31C20.55 41.95 18.89 42.27 17.03 42.27ZM29.1317 42V20.13H36.2117L40.7117 34.44H40.8917L45.3317 20.13H52.4417V42H47.9117V33.36L47.9717 25.02H47.7617L42.6317 42H38.9717L33.8417 25.02H33.6017L33.6917 33.42V42H29.1317Z"
        fill="white"
      />
    </svg>
  );
}
