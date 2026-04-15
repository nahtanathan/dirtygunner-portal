// FILE: src/components/layout/site-header.tsx
import { HeaderAuth } from "@/components/layout/header-auth";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex min-h-[68px] max-w-[1600px] min-w-0 items-center justify-end px-4 py-3 sm:min-h-[72px] sm:px-6 lg:px-8">
        <div className="min-w-0">
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}