import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dirtygunner.com"),
  title: "DirtyGunner Portal",
  description:
    "Leaderboard, raffles, challenges, and bonus hunt updates for the DirtyGunner community.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "DirtyGunner Portal",
    description:
      "Leaderboard, raffles, challenges, and bonus hunt updates for the DirtyGunner community.",
    url: "https://dirtygunner.com",
    siteName: "DirtyGunner",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DirtyGunner",
    description:
      "Leaderboard, raffles, challenges, and bonus hunt updates for the DirtyGunner community.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${interTight.variable} min-h-screen bg-[#020304] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
