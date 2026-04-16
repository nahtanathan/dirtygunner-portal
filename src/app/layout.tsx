import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DirtyGunner Portal",
  description: "DirtyGunner stream site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020817] text-white antialiased">
        {children}
      </body>
    </html>
  );
}