import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * There is no third button style. Every call to action on the site is either
 * the amber fill or the ghost outline; anything else would dilute what amber
 * means. `btn()` exists so anchors can wear the same clothes as <button>.
 */
type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-btn font-sans font-semibold " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-out " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-[#1a1204] hover:bg-[#ffc14d]",
  ghost:
    "border border-line-strong bg-transparent text-text hover:border-amber hover:text-amber",
};

const sizes: Record<Size, string> = {
  md: "px-[22px] py-3 text-[0.95rem]",
  sm: "rounded-cta px-[14px] py-2 text-[0.85rem]",
};

export function btn({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button type={type} className={btn({ variant, size, className })} {...props} />
  );
}
