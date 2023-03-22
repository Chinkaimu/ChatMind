import * as React from "react";
import clsx from "clsx";
import { Link } from "./link";

export function Footer(): JSX.Element {
  return (
    <footer className="flex flex-col items-center gap-4 border-t py-4 !text-gray-500">
      <div className="flex gap-4">
        <Link
          className="no-underline hover:underline"
          href="/privacy"
        >
          Privacy
        </Link>
        <Link
          className="no-underline hover:underline"
          href="/terms"
        >
          Terms
        </Link>
      </div>
      <p>© 2023 ChatMind Labs. All rights reserved.</p>
    </footer>
  );
}
