import clsx from "clsx";
import { Loader } from "lucide-react";
import * as React from "react";

export type SpinnerProps = React.PropsWithChildren<{
  className?: string;
}>;

export function Spinner(props: SpinnerProps): JSX.Element {
  return (
    <span>
      <Loader size={20} className={clsx("animate-spin", props.className)} />
    </span>
  );
}
