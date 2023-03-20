import * as React from "react";
import clsx from "clsx";
import { default as NextLink } from "next/link";

export type LinkProps = React.ComponentProps<typeof NextLink>;

export function Link(props: LinkProps): JSX.Element {
  return (
    <NextLink
      {...props}
      className={clsx(
        `underline text-base`,
        `focus:ring-2 focus:ring-gray-400 focus:ring-offset-2`,
        props.className
      )}
    />
  );
}
