// FILE: src/components/ui/CTAButton.tsx
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function CTAButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-w-0 max-w-full items-center justify-center whitespace-nowrap rounded-[8px] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:px-5 sm:text-sm",
        variant === "primary"
          ? "text-white hover:-translate-y-[1px]"
          : "border hover:-translate-y-[1px]",
        className,
      )}
      style={
        variant === "primary"
          ? {
              background:
                "linear-gradient(90deg, rgba(53,116,202,0.96), rgba(94,164,255,0.92))",
              boxShadow: "0 10px 24px rgba(37,99,235,0.24)",
            }
          : {
              borderColor: "var(--border-subtle)",
              background: "rgba(255,255,255,0.022)",
              color: "var(--text-primary)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
            }
      }
    >
      <span className="min-w-0 truncate">{children}</span>
    </Link>
  );
}
