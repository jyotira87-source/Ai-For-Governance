import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationHeader } from "@/components/NavigationHeader";
import { PageTransition } from "@/components/PageTransition";
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
        <AuthProvider>
          <NavigationHeader />
          <PageTransition>
            {children}
          </PageTransition>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
