import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";
import { SiteHeader } from "../components";
import { Button } from "../components/button";
import { GradientBg } from "../components/gradient-bg/gradient-bg";
import { Link } from "../components/link";

export default function HomePage(): JSX.Element {
  const router = useRouter();
  return (
    <div className="relative h-full">
      <SiteHeader />
      <GradientBg />
      <section className="isolate z-10 flex min-h-full flex-col items-center space-y-24 py-20">
        <div className="space-y-8">
          <h1 className="mt-1 w-full max-w-2xl text-center text-4xl font-black leading-snug text-gray-900">
            <span className="inline-block bg-gradient-to-r from-primary-600 to-lime-600 bg-clip-text text-transparent">
              {strings.heroTitlePoint}
            </span>
          </h1>
          <p className="text-center text-base text-gray-600">
            {strings.heroDescription}
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="default"
              className="group space-x-1 hover:shadow-xl"
              onClick={() => router.push("/chat")}
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
      </section>
    </div>
  );
}

export const strings = {
  heroTitlePoint: "Faster, easier AI Chat experience",
  heroDescription:
    "Experience faster response times and never lose chat histories again with our seamless chat features.",
  callToAction: {
    main: "Get Early Access",
    secondary: "GitHub",
  },
};
