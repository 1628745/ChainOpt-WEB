import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Two families, no more. Archivo carries display and body; IBM Plex Mono
 * carries everything the product would print as data -- code, labels,
 * metrics, metadata -- and ships true tabular numerals for figures in a
 * column.
 */

export const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
