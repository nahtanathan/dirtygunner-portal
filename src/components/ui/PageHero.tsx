import { ReactNode } from "react";
import { PremiumPanel } from "@/components/ui/PremiumPanel";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <PremiumPanel className="overflow-hidden p-6 md:p-8 xl:p-10">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at 88% 12%, rgba(34,211,238,0.12), transparent 22%),
            linear-gradient(135deg, rgba(255,255,255,0.03), transparent 62%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="relative grid gap-8 xl:grid-cols-[1.5fr_0.8fr] xl:items-end">
        <div>
          <div
            className="mb-3 text-sm font-semibold uppercase tracking-[0.35em]"
            style={{ color: "#60A5FA" }}
          >
            {eyebrow}
          </div>

          <h1
            className="max-w-4xl text-4xl font-bold uppercase tracking-wide md:text-6xl"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>

          <p
            className="mt-5 max-w-2xl text-sm leading-7 md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>

          {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? <div className="relative">{aside}</div> : null}
      </div>
    </PremiumPanel>
  );
}