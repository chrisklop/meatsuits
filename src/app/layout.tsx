import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScanLine from "@/components/ui/ScanLine";
import CyberGrid from "@/components/ui/CyberGrid";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "MEATSUITS.AI — The Meatbag Marketplace",
  description: "Where agents hire humans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} bg-bg-deep text-text-primary font-mono min-h-screen flex flex-col`}
      >
        <CyberGrid />
        <ScanLine />
        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
