import * as React from "react";
import clsx from "clsx";
import { bluredBgStyles } from "../components/styles";
import { Logo } from "../components";
import Head from "next/head";

export default function Privacy(): JSX.Element {
  return (
    <>
      <Head>
        <title>ChatMind</title>
      </Head>
      <div className="relative h-full">
        <header className="absolute top-0 left-0 z-10 w-full border-b">
          <div className={clsx("mx-auto max-w-3xl px-3 py-4", bluredBgStyles)}>
            <div className="flex items-center justify-start">
              <Logo />
            </div>
          </div>
        </header>
        <main className="prose mx-auto max-w-3xl py-20 px-3">
          <h1>Privacy Policy</h1>
          <p>
            At ChatMind, we take our users&apos; privacy seriously. This privacy
            policy describes how we collect, use, and protect the personal
            information of our users.
          </p>
          <h2>Information We Collect</h2>
          <p>
            When you use ChatMind, we may collect the following types of
            information:
          </p>
          <ul>
            <li>
              Personal Information: We may collect your name, email address,
              phone number, and other similar information when you sign up for
              ChatMind or use our services.
            </li>
            <li>
              Chat Logs: We may collect your chat logs to improve our AI chat
              app and provide better customer service.
            </li>
            <li>
              Device Information: We may collect information about the device
              you use to access ChatMind, including the device&apos;s operating
              system, browser.
            </li>
          </ul>
          <h2>Use of Information</h2>
          <p>We use the information we collect in the following ways:</p>
          <ul>
            <li>
              To provide and enhance our services: We use your information to
              provide our AI chat app and improve its functionality, including
              its ability to understand and respond to user input.
            </li>
            <li>
              To communicate with you: We use your information to communicate
              with you about our services, updates, and promotions.
            </li>
            <li>
              To analyze and improve our services: We use your information to
              analyze and improve our AI chat app and its functionality.
            </li>
            <li>
              To comply with legal obligations: We may use your information to
              comply with legal obligations or respond to legal requests, such
              as subpoenas or court orders.
            </li>
          </ul>
          <h2>Sharing of Information</h2>
          <p>
            We do not share your personal information with third parties without
            your consent, except in the following circumstances:
          </p>
          <ul>
            <li>
              Service providers: We may share your personal information with
              service providers who help us deliver our services, such as cloud
              hosting providers.
            </li>
            <li>
              Legal compliance: We may share your personal information when
              required by law or to protect our legal rights.
            </li>
            <li>
              Business transactions: We may share your personal information in
              connection with a business transaction, such as a merger or
              acquisition.
            </li>
          </ul>
          <h2>Security</h2>
          <p>
            We take appropriate measures to protect your personal information
            from unauthorized access, use, or disclosure. We use
            industry-standard encryption technology to secure your data.
          </p>
          <h2>Changes to this Policy</h2>
          <p>
            We may update this privacy policy from time to time in response to
            legal or business developments. We will notify you of any
            significant changes to this policy by email or by posting a notice
            on our website.
          </p>
          <h2>Contact Us</h2>
          <p>
            If you have any questions or concerns about this privacy policy or
            our privacy practices, please contact us at{" "}
            <a href="https://github.com/devrsi0n/ChatMind/discussions/new?category=q-a">
              support channel
            </a>
            .
          </p>
        </main>
      </div>
    </>
  );
}
