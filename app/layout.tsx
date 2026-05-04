import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignCode Pro — Florida Sign Permit Research",
  description: "Instantly look up sign code requirements, permit checklists, and jurisdiction contacts for every Florida municipality. Built for sign companies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
