import { Archivo, Geist_Mono } from "next/font/google";

/**
 * Two families, no more. Archivo carries display and body; Geist Mono carries
 * everything the product would print as data -- code, labels, metrics,
 * metadata -- and, being monospace, ships figures that align in a column for
 * free.
 *
 * Geist Mono replaced IBM Plex Mono, whose typewriter slab reads warmer and
 * older than the rest of the page. Geist is the closer relative of Archivo:
 * same grotesque skeleton, so a metric label and the sentence above it look
 * like they were drawn by the same hand.
 */

export const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * The variable cut rather than three static weights: one file covers 400
 * through 600, which is every weight the site asks of it, and costs less than
 * the two extra requests the static cuts would need.
 */
export const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});
