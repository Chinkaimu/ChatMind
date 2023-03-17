import clsx from "clsx";
import * as React from "react";

export type ParagraphProps = React.ComponentPropsWithoutRef<"p"> & {
  as?: "pre";
};

export function Paragraph({ className, as, ...props }: ParagraphProps) {
  const As = as || "p";
  return (
    // @ts-expect-error
    <As
      {...props}
      className={clsx(
        "text-base leading-7 [&:not(:first-child)]:mt-6",
        className
      )}
    />
  );
}

export type SubtleProps = React.ComponentPropsWithoutRef<"small">;
export function Subtle({ className, ...props }: SubtleProps) {
  return (
    <small {...props} className={clsx("text-sm text-gray-500", className)} />
  );
}

export type H2Props = React.ComponentPropsWithoutRef<"h2">;
export function H2(props: H2Props) {
  return (
    <h2
      {...props}
      className={clsx(
        "mt-10 scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0",
        props.className
      )}
    />
  );
}
