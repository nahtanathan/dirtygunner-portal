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
    <div
      className="min-h-screen text-white"
      style={{ background: "var(--bg-main)" }}
    >
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[300px] lg:block">
        <AppSidebar />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[300px]">
        <div className="lg:hidden">
          <MobileNav />
        </div>

        <div className="pointer-events-none fixed right-4 top-4 z-50 hidden lg:block lg:right-6 lg:top-5">
          <div className="pointer-events-auto max-w-[calc(100vw-22rem)]">
            <HeaderAuth />
          </div>
        </div>

        <main
          className="min-h-screen min-w-0 flex-1 overflow-x-hidden px-4 pb-6 pt-20 sm:px-6 md:pb-7 md:pt-[5.25rem] lg:px-8 lg:pb-8 lg:pt-24"
          style={{ background: "transparent" }}
        >
          <div className="mx-auto min-w-0 max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}