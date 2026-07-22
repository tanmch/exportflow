import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExportFlow",
  description: "Omnichannel CRM untuk trader ekspor — satu percakapan, semua channel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full min-h-screen antialiased">{children}</body>
    </html>
  );
}
