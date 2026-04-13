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
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <div
            className="mb-2 text-sm font-semibold uppercase tracking-[0.35em]"
            style={{ color: "#60A5FA" }}
          >
            {eyebrow}
          </div>
        ) : null}

        <h2
          className="text-3xl font-bold tracking-wide md:text-4xl"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>

        {description ? (
          <p
            className="mt-3 text-sm leading-7 md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action}
    </div>
  );
}