import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-static";

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using DirtyGunner.com, you agree to these Terms of Service and any other policies referenced on the site. If you do not agree, do not use the site.",
    ],
  },
  {
    title: "Eligibility",
    body: [
      "You are responsible for making sure your use of the site is legal where you are and that you meet any age or eligibility requirements that apply.",
      "Do not use the site if doing so would break local law, platform rules, or any third-party restrictions that apply to you.",
    ],
  },
  {
    title: "Accounts and Access",
    body: [
      "Some features may require login or a connected third-party account. You are responsible for the accuracy of the information you provide and for keeping your account access secure.",
      "We may suspend, restrict, or terminate access if we believe an account is being used improperly, fraudulently, abusively, or in violation of these terms.",
    ],
  },
  {
    title: "Leaderboards, Challenges, and Raffles",
    body: [
      "Leaderboards, challenges, raffles, prizes, and related promo features are offered as available and may be updated, paused, corrected, or canceled at any time.",
      "We may review entries, remove invalid activity, correct obvious errors, enforce limits, and disqualify abusive, fraudulent, or manipulated participation.",
      "Posted prize structures, challenge rules, or event timelines may also be supplemented by rules shown on the relevant page or sent directly to participants.",
    ],
  },
  {
    title: "No Guarantee of Availability",
    body: [
      "We do not guarantee uninterrupted access to the site or any specific feature. The site may be changed, limited, suspended, or discontinued at any time without notice.",
    ],
  },
  {
    title: "Third-Party Platforms and Content",
    body: [
      "The site may reference or integrate with third-party platforms, services, promotions, or content, including streaming, affiliate, analytics, authentication, or gaming-related providers.",
      "We are not responsible for the availability, actions, content, policies, or performance of third-party services. Use them at your own risk and under their own terms.",
    ],
  },
  {
    title: "Prohibited Conduct",
    body: [
      "Do not misuse the site, interfere with normal operation, reverse engineer protected functionality, automate abuse, scrape restricted data, impersonate others, submit false information, exploit bugs, or try to manipulate outcomes or rewards.",
      "Do not upload unlawful, infringing, harmful, or deceptive content through the site.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "Site content, branding, design, text, graphics, layouts, logos, and custom materials are owned by or licensed to the site operator unless stated otherwise. You may not copy, reproduce, republish, or exploit them without permission.",
    ],
  },
  {
    title: "Disclaimers",
    body: [
      "The site and all features are provided on an “as is” and “as available” basis, without warranties of any kind, to the fullest extent allowed by law.",
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
      "You agree to defend, indemnify, and hold harmless the site operator and related parties from claims, liabilities, damages, losses, and expenses arising out of your use of the site, your violation of these terms, or your violation of another party’s rights.",
    ],
  },
  {
    title: "Termination",
    body: [
      "We may suspend or terminate access to the site or any feature at any time, with or without notice, if we believe you violated these terms or if continued access is not appropriate for legal, operational, or security reasons.",
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      "We may update these Terms of Service at any time. If you keep using the site after updated terms are posted, the revised terms apply.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these terms or site operations, use the available contact or community channels tied to DirtyGunner.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Basic rules for using DirtyGunner.com, including community features, leaderboards, raffles, challenges, and connected third-party services."
      />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6 md:p-7">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 text-sm leading-6 text-zinc-300">
            These terms are a solid starting point for launch. Review them
            again if you later add purchases, subscriptions, jurisdiction-based
            sweepstakes rules, or other regulated flows.
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