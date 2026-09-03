import type { Metadata } from "next";

import { inter, jetbrainsMono } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "ChainOpt",
  description:
    "LLM pipeline analysis and optimization SDK for developers and AI teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
