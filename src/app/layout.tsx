import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "DirtyGunner Portal",
  description: "Premium streamer portal for DirtyGunner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#05060a] text-white antialiased">
        {/* Background layers (unchanged) */}
        <div className="fixed inset-0 -z-20 bg-[#05060a]" />

        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(61,107,255,0.15),transparent_24%),radial-gradient(circle_at_76%_8%,rgba(125,92,255,0.17),transparent_26%),radial-gradient(circle_at_42%_88%,rgba(255,40,92,0.14),transparent_28%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%,transparent_78%,rgba(255,255,255,0.015))]" />

          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        {/* HEADER */}
        <SiteHeader />

        {/* CONTENT */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}