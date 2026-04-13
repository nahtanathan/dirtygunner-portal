// FILE: src/app/(admin)/admin/layout.tsx

import type { ReactNode } from "react";
import PageShell from "@/components/layout/PageShell";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}