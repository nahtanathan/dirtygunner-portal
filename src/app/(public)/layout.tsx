// FILE: src/app/(public)/layout.tsx
import type { ReactNode } from "react";
import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageShell>
      <div className="flex min-h-screen min-w-0 flex-col">
        <div className="min-w-0 flex-1">{children}</div>
        <SiteFooter />
      </div>
    </PageShell>
  );
}