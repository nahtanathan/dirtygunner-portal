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
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 16%, transparent 68%, rgba(0,0,0,0.34) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            background:
              "repeating-linear-gradient(120deg, rgba(255,255,255,0.012) 0, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 26px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,17,23,0.18) 0%, rgba(10,14,20,0.36) 34%, rgba(5,7,10,0.68) 72%, rgba(2,3,4,0.86) 100%)",
          }}
        />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] lg:block">
        <AppSidebar />
      </aside>

      <div className="relative z-10 flex min-h-screen min-w-0 flex-col lg:ml-[264px]">
        <div className="lg:hidden">
          <MobileNav />
        </div>

        <div className="pointer-events-none fixed right-4 top-4 z-50 hidden lg:block lg:right-6 lg:top-5">
          <div className="pointer-events-auto max-w-[calc(100vw-20rem)]">
            <HeaderAuth />
          </div>
        </div>

        <main className="relative min-h-screen min-w-0 flex-1 overflow-x-hidden px-4 pb-8 pt-20 sm:px-6 md:pt-[5.25rem] lg:px-8 lg:pt-24">
          <div className="mx-auto min-w-0 max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
