import { type AppProps, type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/components/utils/api";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "../components";
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="application-name" content="ChatMind" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChatMind" />
        <meta name="description" content="Enhancing your ChatGPT experience" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Enhancing your ChatGPT experience with ChatMind."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="/assets/icons/favicon-196.png"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/icons/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple-splash-2048-2732.png"
          sizes='2048x2732'
        />
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple-splash-1668-2224.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple-splash-1536-2048.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple-splash-1125-2436.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple-splash-1242-2208.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple-splash-750-1334.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple-splash-640-1136.png"
          sizes="640x1136"
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://chatmind.co" />
        <meta name="twitter:title" content="ChatMind" />
        <meta
          name="twitter:description"
          content="Enhancing your ChatGPT experience"
        />
        <meta
          name="twitter:image"
          content="https://chatmind.co/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@devrsi0n" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ChatMind" />
        <meta
          property="og:description"
          content="Enhancing your ChatGPT experience"
        />
        <meta property="og:site_name" content="ChatMind" />
        <meta property="og:url" content="https://chatmind.co" />
        <meta
          property="og:image"
          content="https://chatmind.co/icons/apple-touch-icon.png"
        />
      </Head>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
      <Toaster />
      <Script
        strategy="lazyOnload"
        src="https://unpkg.com/@tinybirdco/flock.js"
        data-host="https://api.tinybird.co"
        data-token="p.eyJ1IjogIjA0NDI3NDEzLTI1Y2ItNGU3Mi05YTgzLThhNGRkZWZkMjIxMCIsICJpZCI6ICI2ZGY3MWE0MC0yNDRhLTQyZjctYmY5MC1kY2NiNjhlNGMxNGIifQ.j3JfEDNF01Xt5057jRZJVZv1RsLKKwkqst7KwVks7Kg"
      />
    </>
  );
};

export default api.withTRPC(MyApp);
