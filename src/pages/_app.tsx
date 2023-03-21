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
