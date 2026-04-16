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
      "We use this information to run the site, manage accounts, handle leaderboard features, process raffles and challenges, answer support requests, and prevent abuse.",
      "We may also use it for analytics, security, moderation, and legal compliance.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "Some features rely on third-party services like Kick, Roobet, Supabase, and other infrastructure providers.",
      "We do not control how third-party platforms handle your data. Their policies apply when you use them.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We may use cookies and similar tools to keep you signed in, remember settings, and improve performance.",
      "Disabling cookies may break parts of the site.",
    ],
  },
  {
    title: "Sharing",
    body: [
      "We do not sell your personal information.",
      "We may share data with service providers that help run the site, or if required for security, enforcement, or legal reasons.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We keep data as long as needed to operate the site, prevent abuse, and meet legal or technical requirements.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use standard measures to protect data, but no system is completely secure.",
    ],
  },
  {
    title: "Eligibility",
    body: [
      "This site is not intended for users below the legal age required in their jurisdiction.",
    ],
  },
  {
    title: "Changes",
    body: [
      "This policy may be updated. Continued use of the site means you accept any changes.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How data is collected and used on this site."
      />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6 md:p-7">
        <div className="mx-auto max-w-4xl space-y-8">
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

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
            Last updated: April 15, 2026
          </div>
        </div>
      </section>
    </div>
  );
}