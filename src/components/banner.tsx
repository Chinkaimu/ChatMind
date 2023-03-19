import * as React from "react";
import { X } from "lucide-react";
import { useNewVersionAvailable } from "../hooks/use-new-version-available";
import { BaseButton } from "./button";

export function Banner(): JSX.Element {
  const { isNewVersionAvailable, handleDismiss, handleUpgrade } =
    useNewVersionAvailable();
  if (!isNewVersionAvailable) {
    return <></>;
  }
  return (
    <div className="flex justify-between rounded-t bg-primary-600 py-1.5 px-4 text-sm">
      <div className="flex items-center gap-4">
        <IconStart />
        <p className="font-semibold text-white">A new version is available!</p>
      </div>
      <div className="flex items-center gap-2">
        <BaseButton
          className="rounded bg-white px-2 py-1 text-primary-600 hover:bg-primary-100"
          onClick={handleUpgrade}
        >
          Upgrade
        </BaseButton>
        <BaseButton
          className="rounded p-2 text-white hover:bg-gray-400/75"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X size={16} />
        </BaseButton>
      </div>
    </div>
  );
}

function IconStart() {
  return (
    <svg
      width={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
