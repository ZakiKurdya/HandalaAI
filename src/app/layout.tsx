import type { Metadata, Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "Handala — حنظلة",
  description:
    "An evidence-based, bilingual AI companion for learning Palestinian history, geography, and culture — citation-first, never sloganeering.",
  metadataBase: new URL("https://handala.local"),
  openGraph: {
    title: "Handala — حنظلة",
    description: "A memory that never dies — bilingual, citation-first AI for Palestinian history and culture.",
    type: "website",
  },
  icons: { icon: "/handala-icon.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf2" },
    { media: "(prefers-color-scheme: dark)", color: "#0e110c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen surface antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
