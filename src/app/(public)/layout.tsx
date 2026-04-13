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
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </PageShell>
  );
}