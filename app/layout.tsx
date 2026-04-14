import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horizon - Automated AI news aggregator & summarizer.",
  description: "AI curates the news. You just read.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
