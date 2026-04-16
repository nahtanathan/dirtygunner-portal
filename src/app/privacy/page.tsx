import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-static";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We may collect information you choose to provide directly, such as account details, profile information, challenge submissions, raffle entries, and messages you send through the site.",
      "We may also collect technical information automatically, including browser type, device details, IP address, pages viewed, referral information, and general usage analytics used to improve site performance and security.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use collected information to operate the site, manage accounts, run leaderboard features, process raffles and challenges, respond to support requests, prevent abuse, and improve the overall user experience.",
      "We may also use information for internal analytics, fraud prevention, moderation, security monitoring, and compliance with applicable laws or platform requirements.",
    ],
  },
  {
    title: "Kick, Roobet, and Third-Party Services",
    body: [
      "If you connect or interact with third-party services, including Kick, Roobet, Supabase, payment, storage, or analytics providers, certain information may be processed through those services in order to power features on the site.",
      "We do not control the privacy practices of third-party platforms. Your use of those services is also subject to their own terms and privacy policies.",
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    body: [
      "We may use cookies, session storage, and similar technologies to keep you signed in, remember preferences, improve performance, and understand how the site is being used.",
      "You can usually control cookies through your browser settings, but disabling them may affect certain parts of the site.",
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We do not sell your personal information. We may share information with service providers and infrastructure partners that help us host, secure, maintain, or operate the site.",
      "We may also disclose information when reasonably necessary to enforce our rules, investigate abuse, protect users or the public, or comply with legal obligations.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We keep information for as long as reasonably necessary to operate the site, maintain records, resolve disputes, prevent fraud, and meet legal, technical, or business requirements.",
      "Retention periods may vary depending on the type of information and how it is used.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use reasonable administrative, technical, and organizational measures to protect information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Children",
    body: [
      "This site is not intended for children. Do not use the site if you are under the minimum legal age required in your jurisdiction to access the services or content presented here.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may choose not to provide certain information, but some features may not function properly without it. You may also request account-related help or data questions by contacting the site operator through the available support channels.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Continued use of the site after changes are posted means the updated policy will apply going forward.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Basic terms covering how DirtyGunner.com collects, uses, stores, and protects information connected to site access and community features."
      />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6 md:p-7">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 text-sm leading-6 text-zinc-300">
            This page is a general baseline policy for the site and community
            features. It should be reviewed and adjusted if you later add
            payments, more advanced tracking, direct marketing flows, or other
            regulated features.
          </div>

          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {section.title}
              </h2>

              <div className="space-y-4 text-sm leading-7 text-zinc-300 sm:text-[15px]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-400">
            Last updated: April 15, 2026
          </div>
        </div>
      </section>
    </div>
  );
}