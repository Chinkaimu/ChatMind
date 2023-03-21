import * as React from "react";
import { type Workbox, type WorkboxLifecycleWaitingEvent } from "workbox-window";

declare global {
  interface Window {
    workbox: Workbox;
  }
}

export function useNewVersionAvailable() {
  const [isNewVersionAvailable, setIsNewVersionAvailable] =
    React.useState(false);
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox as Workbox;
      const handleSwWating = (_event: WorkboxLifecycleWaitingEvent) => {
        // `_event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        setIsNewVersionAvailable(true);
      };
      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      wb.addEventListener("waiting", handleSwWating);
      // never forget to call register as auto register is turned off in next.config.js
      wb.register();

      return () => {
        wb.removeEventListener("waiting", handleSwWating);
      };
    }
  }, []);
  const handleUpgrade = React.useCallback(() => {
    const wb = window.workbox as Workbox;

    wb.addEventListener("controlling", (_) => {
      window.location.reload();
    });

    // Send a message to the waiting service worker, instructing it to activate.
    wb.messageSkipWaiting();
  }, []);
  const handleDismiss = React.useCallback(() => {
    setIsNewVersionAvailable(false);
  }, []);
  return { isNewVersionAvailable, handleUpgrade, handleDismiss };
}
