import { type AppProps, type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from '../components';

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
