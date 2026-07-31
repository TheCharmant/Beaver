import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beaver | Student Research & Software Development Support",
  description: "BE A VERsion of Success. Expert mentoring, software deengineering support, technical consultation, documentation guidance, and defense preparation for students."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
