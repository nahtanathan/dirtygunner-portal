import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-static";

const sections = [
  {
    title: "Acceptance",
    body: [
      "By using this site, you agree to these terms. If you don’t agree, do not use the site.",
    ],
  },
  {
    title: "Eligibility",
    body: [
      "You are responsible for making sure your use of this site is legal where you are.",
      "Do not use the site if you are not allowed to access the services shown.",
    ],
  },
  {
    title: "Accounts",
    body: [
      "You are responsible for your account and any activity tied to it.",
      "Access may be restricted or removed if rules are broken.",
    ],
  },
  {
    title: "Leaderboards, Raffles, Challenges",
    body: [
      "All events, prizes, and features can be updated, paused, or canceled at any time.",
      "We may remove invalid entries, fix errors, or disqualify abuse or manipulation.",
    ],
  },
  {
    title: "Availability",
    body: [
      "The site may change, go offline, or be updated at any time without notice.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "This site may link to or use third-party platforms.",
      "We are not responsible for their behavior, policies, or performance.",
    ],
  },
  {
    title: "Prohibited Use",
    body: [
      "Do not exploit bugs, automate abuse, submit false data, or interfere with the site.",
      "Do not upload illegal or harmful content.",
    ],
  },
  {
    title: "Ownership",
    body: [
      "All site content, branding, and design belong to the site unless stated otherwise.",
    ],
  },
  {
    title: "Disclaimer",
    body: [
      "The site is provided as-is with no guarantees.",
    ],
  },
  {
    title: "Liability",
    body: [
      "We are not liable for losses, damages, or issues from using the site.",
    ],
  },
  {
    title: "Changes",
    body: [
      "These terms may change at any time. Continued use means you accept updates.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Rules for using this site."
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