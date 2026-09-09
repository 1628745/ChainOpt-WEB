"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Reports the motion preference of the reader, and keeps reporting it if they
 * change it mid-visit.
 *
 * The server snapshot is `false` because the preference is unknowable there,
 * so anything gated on this must be safe to show for the first paint, or be
 * driven from an event rather than from markup. CSS carries the burden of the
 * reduced-motion contract; this hook only exists for the sequences JavaScript
 * schedules itself and CSS cannot see.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
