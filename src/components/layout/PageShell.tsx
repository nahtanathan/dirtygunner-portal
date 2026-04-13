import type { ReactNode } from "react";
import AppSidebar from "@/components/navigation/AppSidebar";
import MobileNav from "@/components/navigation/MobileNav";

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-main)" }}>
      <AppSidebar />
      <MobileNav />

      <main className="min-h-screen md:pl-[286px]">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute left-[-140px] top-[-120px] h-[380px] w-[380px] rounded-full blur-3xl"
              style={{ background: "rgba(59,130,246,0.09)" }}
            />
            <div
              className="absolute right-[-100px] top-[8%] h-[320px] w-[320px] rounded-full blur-3xl"
              style={{ background: "rgba(34,211,238,0.06)" }}
            />
            <div
              className="absolute bottom-[-140px] left-[18%] h-[280px] w-[280px] rounded-full blur-3xl"
              style={{ background: "rgba(59,130,246,0.05)" }}
            />
          </div>

          <div className="relative w-full pb-10 pt-4 md:pb-14 md:pt-8">
            <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 xl:px-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}