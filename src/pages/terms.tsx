/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import clsx from "clsx";
import Head from "next/head";
import { SiteHeader } from "../components";
import { Footer } from '../components/footer';

export default function Terms(): JSX.Element {
  return (
    <>
      <Head>
        <title>{`ChatMind's terms of servic`}</title>
      </Head>
      <div>
        <SiteHeader />
        <main className="prose mx-auto max-w-3xl py-20 px-3">
          <h1>Terms of Service</h1>
          <h2>1. Terms</h2>
          <p>
            By accessing the website at ChatMind, you agree to be bound by these
            terms of service, all applicable laws andregulations, and agree that
            you are responsible for compliance with any applicable local laws.
            If you do not agree with any of these terms, you are prohibited from
            using or accessing this site. The materials contained in this
            website are protected by applicable copyright and trademark law.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the
            materials (information or software) on ChatMind's website for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title, and under this license you
            may not:
          </p>

          <p>
            Modify or copy the materials; use the materials for any commercial
            purpose, or for any public display (commercial or non-commercial);
            attempt to decompile or reverse engineer any software contained on
            ChatMind's website; remove any copyright or other proprietary
            notations from the materials; or transfer the materials to another
            person or “mirror” the materials on any other server. This license
            shall automatically terminate if you violate any of these
            restrictions and may be terminated by ChatMind at any time. Upon
            terminating your viewing of these materials or upon the termination
            of this license, you must destroy any downloaded materials in your
            possession whether in electronic or printed format.
          </p>

          <h2>3. Disclaimer</h2>
          <ol>
            <li>
              The materials on ChatMind's website are provided on an 'as is'
              basis. ChatMind makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </li>
            <li>
              Further, ChatMind does not warrant or make any representations
              concerning the accuracy, likely results, or reliability of the use
              of the materials on its website or otherwise relating to such
              materials or on any sites linked to this site.
            </li>
          </ol>

          <h2>4. Limitations</h2>
          <p>
            In no event shall ChatMind or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on ChatMind's website, even if
            ChatMind or a ChatMind authorized representative has been notified
            orally or in writing of the possibility of such damage. Because some
            jurisdictions do not allow limitations on implied warranties, or
            limitations of liability for consequential or incidental damages,
            these limitations may not apply to you.
          </p>

          <h2>5. Accuracy of materials</h2>
          <p>
            The materials appearing on ChatMind website could includetechnical,
            typographical, or photographic errors. ChatMind does not warrant
            that any of the materials on its website are accurate, complete or
            current. ChatMind may make changes to the materials contained on its
            website at any time without notice. However, ChatMind does not make
            any commitment to update the materials.
          </p>

          <h2>6. Links</h2>
          <p>
            ChatMind has not reviewed all the sites linked to its website and is
            not responsible for the contents of any such linked site. The
            inclusion of any link does not imply endorsement by ChatMind of the
            site. Use of any such linked website is at the user's own risk.
          </p>

          <h2>7. Modifications</h2>
          <p>
            ChatMind may revise these terms of service for its website at any
            time without notice. By using this website you agree to be bound by
            the then current version of these terms of service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws and you irrevocably submit to the exclusive
            jurisdiction of the courts in that State or location.
          </p>
        </main>
        <Footer />
      </div>
    </>
  );
}
