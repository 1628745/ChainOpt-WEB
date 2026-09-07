import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { archivo, ibmPlexMono } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";

import "./globals.css";

const description =
  "ChainOpt analyses your LLM agent pipelines and points at the calls costing you money — redundant pairs, oversized models, and work that could run in parallel — with the prompt and response evidence behind every finding.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ChainOpt: find the LLM calls costing you money",
    template: "%s | ChainOpt",
  },
  description,
  applicationName: "ChainOpt",
  keywords: [
    "LLM pipeline optimization",
    "LLM cost reduction",
    "LangChain",
    "LangGraph",
    "AI agent observability",
    "prompt redundancy detection",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ChainOpt",
    title: "ChainOpt: find the LLM calls costing you money",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainOpt: find the LLM calls costing you money",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-btn focus:bg-amber focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#1a1204]"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
