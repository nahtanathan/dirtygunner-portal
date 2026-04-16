import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-static";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We may collect information you give us directly, like account details, profile info, challenge submissions, raffle entries, and messages sent through the site.",
      "We may also collect technical data automatically, including browser type, device details, IP address, pages viewed, referral data, and basic usage analytics used for performance and security.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use this information to run the site, manage accounts, handle leaderboard features, process raffles and challenges, answer support requests, and stop abuse.",
      "We may also use it for analytics, fraud prevention, moderation, security, and legal compliance.",
    ],
  },
  {
    title: "Kick, Roobet, and Third-Party Services",
    body: [
      "If you connect or use third-party services like Kick, Roobet, Supabase, payment providers, storage providers, or analytics tools, some information may be processed through those services to make site features work.",
      "We do not control how third-party platforms handle your data. Your use of those services is also subject to their own terms and privacy policies.",
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    body: [
      "We may use cookies, session storage, and similar tools to keep you signed in, remember settings, improve performance, and understand site usage.",
      "You can usually control cookies through your browser settings, but disabling them may break parts of the site.",
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We do not sell your personal information. We may share information with service providers and infrastructure partners that help us host, secure, maintain, or run the site.",
      "We may also disclose information when needed to enforce site rules, investigate abuse, protect users or the public, or comply with legal obligations.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We keep information for as long as needed to run the site, keep records, resolve disputes, prevent fraud, and meet legal, technical, or business requirements.",
      "How long we keep data depends on what it is and how it is used.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use reasonable administrative, technical, and organizational measures to protect information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Children",
    body: [
      "This site is not for children. Do not use it if you are under the minimum legal age required in your area to access the services or content shown here.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You can choose not to provide certain information, but some features may not work without it. You can also request account help or ask data-related questions through the available contact channels.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. If you keep using the site after changes are posted, the updated policy applies.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How DirtyGunner.com collects, uses, stores, and protects information tied to site access and community features."
      />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6 md:p-7">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 text-sm leading-6 text-zinc-300">
            This is a base privacy policy for the current site. It should be
            reviewed again if you later add payments, heavier tracking, direct
            marketing, or other regulated features.
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