import { HeaderAuth } from "@/components/layout/header-auth";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex h-20 max-w-[1600px] items-start justify-end px-4 pt-4 md:px-6">
        <div className="flex items-center">
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}