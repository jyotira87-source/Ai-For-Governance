import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolisAI — AI Governance Intelligence Platform",
  description: "AI-powered governance policy analyzer"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}

