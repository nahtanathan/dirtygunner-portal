// FILE: src/components/ui/SectionHeader.tsx
import { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <div
            className="mb-2 text-label-tight"
            style={{ color: "#60A5FA" }}
          >
            {eyebrow}
          </div>
        ) : null}

        <h2
          className="truncate-2 text-responsive-heading font-bold tracking-wide"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>

        {description ? (
          <p
            className="truncate-3 mt-3 max-w-[42rem] text-responsive-body"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}