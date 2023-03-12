import clsx from "clsx";
import * as React from "react";

export type TypographyPProps = React.ComponentPropsWithoutRef<"p"> & {
  as?: "pre"
};

export function TypographyP({ className, as, ...props }: TypographyPProps) {
  const As = as || "p";
  return (
    // @ts-expect-error
    <As
      {...props}
      className={clsx("leading-7 [&:not(:first-child)]:mt-6 text-base", className)}
    />
  );
}

export type TypographySubtleProps = React.ComponentPropsWithoutRef<"small">;
export function TypographySubtle({
  className,
  ...props
}: TypographySubtleProps) {
  return (
    <small
      {...props}
      className={clsx("text-sm text-slate-500 dark:text-slate-400", className)}
    />
  );
}
