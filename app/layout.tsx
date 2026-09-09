import type { Metadata } from "next";
// import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: { default: "Homegrown4Heroes", template: "%s | Homegrown4Heroes" },
  description: "Supporting veterans through plant-based wellness, education, gardening, and community.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><div className="crisis-bar"><span>Veteran in crisis or concerned about one?</span><a href="https://www.veteranscrisisline.net/" target="_blank" rel="noreferrer">Connect with the Veterans Crisis Line</a></div><SiteHeader /><main id="main">{children}</main><SiteFooter /><Analytics /></body></html>
  );
}
