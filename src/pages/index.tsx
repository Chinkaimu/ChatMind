import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";
import { SiteHeader } from "../components";
import { Button } from "../components/button";
import { Footer } from "../components/footer";
import { GradientBg } from "../components/gradient-bg/gradient-bg";

export default function HomePage(): JSX.Element {
  const router = useRouter();
  return (
    <div className="relative h-full">
      <GradientBg />
      <SiteHeader />
      <main className="isolate flex min-h-full flex-col items-center space-y-24 py-20">
        <div className="space-y-8">
          <p className="text-center text-sm font-semibold text-primary-500">
            Introducing ChatMind
          </p>
          <div className="space-y-4">
            <h1 className="mt-1 w-full max-w-3xl text-center text-4xl font-black leading-snug text-gray-900">
              <span className="inline-block bg-gradient-to-r from-primary-600 to-lime-600 bg-clip-text text-transparent">
                {strings.heroTitle}
              </span>
            </h1>
            <p className="text-center text-base text-gray-600">
              {strings.heroDescription}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="default"
              className="group space-x-1 hover:shadow-xl"
              onClick={() => router.push("https://app.chatmind.co")}
            >
              <span>{strings.callToAction.main}</span>
              <ArrowRight
                size="20px"
                className="inline-block transition group-hover:translate-x-1"
              />
            </Button>
            <Button
              variant="link"
              onClick={() =>
                router.push("https://github.com/devrsi0n/ChatMind")
              }
            >
              {strings.callToAction.secondary}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const strings = {
  heroTitle: "Faster, smoother ChatGPT experience",
  heroDescription:
    "Experience faster response times and never lose chat histories again with our seamless chat features",
  callToAction: {
    main: "Get Early Access",
    secondary: "GitHub",
  },
};
