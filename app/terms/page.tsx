import Link from "next/link";
import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";

export const metadata = {
  title: "Terms and Conditions — Duolync",
  description: "Terms and Conditions for Duolync. Last updated May 18, 2026.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "var(--bg-navbar)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid var(--border-card)",
        }}
      >
        <Navbar />
      </div>

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">
              Legal
            </p>
            <h1
              className="font-display font-bold text-white mb-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}
            >
              Terms and Conditions
            </h1>
            <p className="text-sm text-zinc-500">Last updated: May 18, 2026</p>
          </div>

          {/* Divider */}
          <div className="h-px mb-12" style={{ background: "var(--border-card)" }} />

          {/* Body */}
          <div className="prose-legal">
            <p>
              Please read these terms and conditions carefully before using Our Service.
            </p>

            <h2>Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>
              The words whose initial letters are capitalized have meanings defined under the following conditions. The
              following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3>Definitions</h3>
            <p>For the purposes of these Terms and Conditions:</p>
            <ul>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where &ldquo;control&rdquo; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Country</strong> refers to: Georgia</li>
              <li><strong>Company</strong> (referred to as either &ldquo;the Company&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo; or &ldquo;Our&rdquo; in these Terms and Conditions) refers to Duolync.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Terms and Conditions</strong> (also referred to as &ldquo;Terms&rdquo;) means these Terms and Conditions, including any documents expressly incorporated by reference, which govern Your access to and use of the Service and form the entire agreement between You and the Company regarding the Service.</li>
              <li><strong>Third-Party Social Media Service</strong> means any services or content provided by a third party that is displayed, included, made available, or linked to through the Service.</li>
              <li><strong>Website</strong> refers to Duolync, accessible from <a href="https://duolync.com/" target="_blank" rel="noopener noreferrer">https://duolync.com/</a>.</li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h2>Acknowledgment</h2>
            <p>
              These are the Terms and Conditions governing the use of this Service and the agreement between You and the
              Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the
              Service.
            </p>
            <p>
              Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and
              Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with
              any part of these Terms and Conditions then You may not access the Service.
            </p>
            <p>
              You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
            </p>
            <p>
              Your access to and use of the Service is also subject to Our{" "}
              <Link href="/privacy">Privacy Policy</Link>, which describes how We collect, use, and disclose personal
              information. Please read Our Privacy Policy carefully before using Our Service.
            </p>

            <h2>Links to Other Websites</h2>
            <p>
              Our Service may contain links to third-party websites or services that are not owned or controlled by the
              Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or
              practices of any third-party websites or services.
            </p>
            <p>
              You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly,
              for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any
              such content, goods or services available on or through any such websites or services.
            </p>
            <p>
              We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or
              services that You visit.
            </p>

            <h3>Links from a Third-Party Social Media Service</h3>
            <p>
              The Service may display, include, make available, or link to content or services provided by a Third-Party
              Social Media Service. A Third-Party Social Media Service is not owned or controlled by the Company, and the
              Company does not endorse or assume responsibility for any Third-Party Social Media Service.
            </p>
            <p>
              You acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any
              damage or loss caused or alleged to be caused by or in connection with Your access to or use of any
              Third-Party Social Media Service, including any content, goods, or services made available through them. Your
              use of any Third-Party Social Media Service is governed by that Third-Party Social Media Service&apos;s terms and
              privacy policies.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend Your access immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your
              right to use the Service will cease immediately.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers
              under any provision of these Terms and Your exclusive remedy for all of the foregoing shall be limited to the
              amount actually paid by You through the Service or 100 USD if You haven&apos;t purchased anything through the
              Service.
            </p>
            <p>
              To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable
              for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to,
              damages for loss of profits, loss of data or other information, for business interruption, for personal injury,
              loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party
              software and/or third-party hardware used with the Service, or otherwise in connection with any provision of
              these Terms), even if the Company or any supplier has been advised of the possibility of such damages and even
              if the remedy fails of its essential purpose.
            </p>
            <p>
              Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or
              consequential damages, which means that some of the above limitations may not apply. In these states, each
              party&apos;s liability will be limited to the greatest extent permitted by law.
            </p>

            <h2>&ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; Disclaimer</h2>
            <p>
              The Service is provided to You &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; and with all faults and defects without warranty of
              any kind. To the maximum extent permitted under applicable law, the Company expressly disclaims all warranties,
              whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties
              of merchantability, fitness for a particular purpose, title and non-infringement.
            </p>
            <p>
              Without limiting the foregoing, neither the Company nor any of the company&apos;s provider makes any
              representation or warranty of any kind, express or implied: (i) as to the operation or availability of the
              Service; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or
              currency of any information or content provided through the Service; or (iv) that the Service, its servers,
              the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses,
              worms, malware, timebombs or other harmful components.
            </p>

            <h2>Governing Law</h2>
            <p>
              The laws of the Country, excluding its conflicts of law rules, shall govern these Terms and Your use of the
              Service. Your use of the Application may also be subject to other local, state, national, or international
              laws.
            </p>

            <h2>Disputes Resolution</h2>
            <p>
              If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally
              by contacting the Company.
            </p>

            <h2>For European Union (EU) Users</h2>
            <p>
              If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country
              in which You are resident.
            </p>

            <h2>United States Legal Compliance</h2>
            <p>
              You represent and warrant that (i) You are not located in a country that is subject to the United States
              government embargo, or that has been designated by the United States government as a &ldquo;terrorist supporting&rdquo;
              country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.
            </p>

            <h2>Severability and Waiver</h2>
            <h3>Severability</h3>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and
              interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law
              and the remaining provisions will continue in full force and effect.
            </p>
            <h3>Waiver</h3>
            <p>
              Except as provided herein, the failure to exercise a right or to require performance of an obligation under
              these Terms shall not affect a party&apos;s ability to exercise such right or require such performance at any time
              thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.
            </p>

            <h2>Translation Interpretation</h2>
            <p>
              These Terms and Conditions may have been translated if We have made them available to You on our Service. You
              agree that the original English text shall prevail in the case of a dispute.
            </p>

            <h2>Changes to These Terms and Conditions</h2>
            <p>
              We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is
              material We will make reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking
              effect. What constitutes a material change will be determined at Our sole discretion.
            </p>
            <p>
              By continuing to access or use Our Service after those revisions become effective, You agree to be bound by
              the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
            <ul>
              <li>
                By email:{" "}
                <a href="mailto:hello@duolync.com">hello@duolync.com</a>
              </li>
            </ul>
          </div>

          {/* Back link */}
          <div className="mt-16 pt-10" style={{ borderTop: "1px solid var(--border-card)" }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors duration-200"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .prose-legal {
          color: #94a3b8;
          font-size: 0.9375rem;
          line-height: 1.8;
        }
        .prose-legal p {
          margin-bottom: 1.25rem;
        }
        .prose-legal h2 {
          font-family: var(--font-display, inherit);
          font-weight: 700;
          font-size: 1.35rem;
          color: #f1f5f9;
          margin-top: 2.75rem;
          margin-bottom: 0.75rem;
        }
        .prose-legal h3 {
          font-weight: 600;
          font-size: 1.05rem;
          color: #cbd5e1;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .prose-legal ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1.25rem;
        }
        .prose-legal ul li {
          position: relative;
          padding-left: 1.25rem;
          margin-bottom: 0.6rem;
        }
        .prose-legal ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6d28d9;
        }
        .prose-legal a {
          color: #a78bfa;
          text-decoration: none;
          transition: color 0.2s;
        }
        .prose-legal a:hover {
          color: #fff;
        }
        .prose-legal strong {
          color: #e2e8f0;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
