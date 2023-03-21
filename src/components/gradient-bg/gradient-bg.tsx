import * as React from "react";
import clsx from "clsx";
import styles from "./gradient-bg.module.scss";

export function GradientBg(): JSX.Element {
  return (
    <div
      className={clsx(
        "before:absolute before:inset-0 before:content-['']",
        styles.layoutWrapper
      )}
    ></div>
  );
}
