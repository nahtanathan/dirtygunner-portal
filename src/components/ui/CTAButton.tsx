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
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300",
        variant === "primary"
          ? "text-white hover:-translate-y-[1px]"
          : "border hover:-translate-y-[1px]",
        className
      )}
      style={
        variant === "primary"
          ? {
              background:
                "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
              boxShadow: "0 14px 30px rgba(37,99,235,0.26)",
            }
          : {
              borderColor: "var(--border-subtle)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--text-primary)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
            }
      }
    >
      {children}
    </Link>
  );
}