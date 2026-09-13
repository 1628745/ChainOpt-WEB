import { ImageResponse } from "next/og";

export const alt = "ChainOpt: find the LLM calls costing you money";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0C1220";
const TEXT = "#E9EEF8";
const DIM = "#94A2BD";
const AMBER = "#FFB224";
const TEAL = "#3ADFC5";
const GRAY = "#94A2BD";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* The same cut-edge glyph as the site header and the favicon. */}
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.6 7.9 15.6 10.8"
              stroke={TEAL}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M7.6 16.1 9.9 15.3M13.4 14.0 15.6 13.2"
              stroke={GRAY}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="5" cy="6.6" r="2.6" stroke={TEAL} strokeWidth="1.6" />
            <circle cx="5" cy="17.4" r="2.6" stroke={GRAY} strokeWidth="1.6" />
            <circle cx="19" cy="12" r="3" fill={AMBER} />
          </svg>
          <div style={{ fontSize: 32, color: TEXT, letterSpacing: -0.6 }}>
            ChainOpt
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.1,
              color: TEXT,
              letterSpacing: -2.4,
              maxWidth: 940,
            }}
          >
            Your agent pipeline is paying for calls it does not need.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 27,
              color: DIM,
              maxWidth: 900,
            }}
          >
            Redundant calls, oversized models, and steps waiting on each other
            for no reason, with the evidence behind every finding.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 24, color: TEAL }}>$</div>
          <div style={{ fontSize: 24, color: TEXT }}>chainopt analyze ./src</div>
        </div>
      </div>
    ),
    size,
  );
}
