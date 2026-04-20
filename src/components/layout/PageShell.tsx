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
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "url('/art/bg-topo.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "url('/art/bg-grid.png')",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundSize: "1400px auto",
          }}
        />
        <div className="absolute inset-y-0 left-0 w-[26rem] bg-[radial-gradient(circle_at_left_center,rgba(68,125,215,0.15),transparent_62%)]" />
        <div className="absolute right-0 top-0 h-[26rem] w-[26rem] bg-[radial-gradient(circle,rgba(92,167,255,0.12),transparent_68%)]" />
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage: "url('/art/overlay-vignette.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
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

        <main className="relative min-h-screen min-w-0 flex-1 overflow-x-hidden px-4 pb-6 pt-20 sm:px-6 md:pb-7 md:pt-[5.25rem] lg:px-8 lg:pb-8 lg:pt-24">
          <div className="mx-auto min-w-0 max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
