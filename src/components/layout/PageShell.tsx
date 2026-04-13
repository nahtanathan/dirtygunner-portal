// FILE: src/components/layout/PageShell.tsx

import type { ReactNode } from "react";
import AppSidebar from "@/components/navigation/AppSidebar";
import MobileNav from "@/components/navigation/MobileNav";
import { HeaderAuth } from "@/components/layout/header-auth";

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[300px] lg:block">
        <AppSidebar />
      </aside>

      <div className="flex min-h-screen flex-col lg:ml-[300px]">
        <div className="lg:hidden">
          <MobileNav />
        </div>

        <div className="pointer-events-none fixed right-4 top-4 z-50 lg:right-6 lg:top-5">
          <div className="pointer-events-auto">
            <HeaderAuth />
          </div>
        </div>

        <main className="min-h-screen flex-1 overflow-x-hidden bg-[#020817] px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pb-8 lg:pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}