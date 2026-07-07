import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: {
    default: "DNA by Humaan",
    template: "%s · DNA by Humaan",
  },
  description:
    "Git remembers your code. DNA remembers your system. Project intelligence, knowledge packs, and AI-ready context for modern teams.",
  metadataBase: new URL("https://dna.humaan.app"),
  openGraph: {
    title: "DNA by Humaan",
    description: "Project brain, knowledge marketplace, and AI context for TypeScript teams.",
    url: "https://dna.humaan.app",
    siteName: "DNA by Humaan",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="min-h-screen font-sans flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
