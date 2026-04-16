import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-static";

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using DirtyGunner.com, you agree to be bound by these Terms of Service and any applicable policies referenced on the site. If you do not agree, do not use the site.",
    ],
  },
  {
    title: "Eligibility",
    body: [
      "You are responsible for ensuring that your use of the site is lawful in your location and that you meet any applicable age or eligibility requirements.",
      "You must not use the site if doing so would violate local law, platform rules, or any applicable third-party restrictions.",
    ],
  },
  {
    title: "Accounts and Access",
    body: [
      "Some features may require login or a connected third-party account. You are responsible for the accuracy of the information you provide and for maintaining the security of your account access.",
      "We may suspend, restrict, or terminate access if we believe an account is being used improperly, fraudulently, abusively, or in violation of these terms.",
    ],
  },
  {
    title: "Leaderboards, Challenges, and Raffles",
    body: [
      "Leaderboard standings, community challenges, raffles, prizes, and related promotional features are offered on an as-available basis and may be updated, paused, corrected, or canceled at any time.",
      "We reserve the right to review entries, remove invalid activity, correct obvious errors, enforce limits, and disqualify abusive, fraudulent, or manipulated participation.",
      "Any posted prize structure, challenge rule, or event timeline may be supplemented by additional rules shown on the relevant page or communicated directly to participants.",
    ],
  },
  {
    title: "No Guarantee of Availability",
    body: [
      "We do not guarantee uninterrupted access to the site or any specific feature. The site may be changed, suspended, limited, or discontinued at any time without notice.",
    ],
  },
  {
    title: "Third-Party Platforms and Content",
    body: [
      "The site may reference or integrate with third-party platforms, services, promotions, or content, including streaming, affiliate, analytics, authentication, or gaming-related providers.",
      "We are not responsible for the availability, actions, content, policies, or performance of third-party services. Your use of them is at your own risk and subject to their own terms.",
    ],
  },
  {
    title: "Prohibited Conduct",
    body: [
      "You agree not to misuse the site, interfere with normal operation, reverse engineer protected functionality, automate abuse, scrape restricted data, impersonate others, submit false information, exploit bugs, or attempt to manipulate outcomes or rewards.",
      "You also agree not to upload unlawful, infringing, harmful, or deceptive content through the site.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "Site content, branding, design, text, graphics, layouts, logos, and custom materials are owned by or licensed to the site operator unless otherwise stated. You may not copy, reproduce, republish, or exploit them without permission.",
    ],
  },
  {
    title: "Disclaimers",
    body: [
      "The site and all features are provided on an 'as is' and 'as available' basis without warranties of any kind, whether express or implied, to the fullest extent allowed by law.",
      "We do not guarantee accuracy, completeness, availability, fitness for a particular purpose, or error-free operation.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, DirtyGunner.com and its operators will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, data, goodwill, use, or business opportunity arising from or related to your use of the site.",
    ],
  },
  {
    title: "Indemnification",
    body: [
      "You agree to defend, indemnify, and hold harmless the site operator and related parties from claims, liabilities, damages, losses, and expenses arising out of your use of the site, your violation of these terms, or your violation of any rights of another party.",
    ],
  },
  {
    title: "Termination",
    body: [
      "We may suspend or terminate access to the site or any feature at any time, with or without notice, if we believe you violated these terms or if continued access is not desirable for legal, operational, or security reasons.",
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      "We may revise these Terms of Service at any time. Continued use of the site after updated terms are posted means the revised terms will apply going forward.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these terms or site operations, use the available contact or community channels associated with DirtyGunner.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Basic terms governing access to DirtyGunner.com, including community features, leaderboards, raffles, challenge participation, and connected third-party services."
      />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6 md:p-7">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 text-sm leading-6 text-zinc-300">
            These terms are a practical starting point for launch. They should
            be reviewed and tightened further if you later add purchases,
            subscriptions, sweepstakes rules by jurisdiction, or other
            regulated flows.
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