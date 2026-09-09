import { ImageResponse } from "next/og";

export const alt =
  "ChainOpt: find the LLM calls costing you money";
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
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: AMBER,
            }}
          />
          <div style={{ width: 34, height: 2, background: GRAY }} />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              border: `2px solid ${TEAL}`,
            }}
          />
          <div
            style={{
              marginLeft: 10,
              fontSize: 30,
              color: TEXT,
              letterSpacing: 0.5,
            }}
          >
            chainopt
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
            Your traces show what the pipeline cost. ChainOpt shows which calls
            to cut.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 27,
              color: DIM,
              maxWidth: 860,
            }}
          >
            Redundant calls, oversized models, and missed parallelism — with
            the evidence behind every finding.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 24, color: TEAL }}>$</div>
          <div style={{ fontSize: 24, color: TEXT }}>pip install chainopt</div>
        </div>
      </div>
    ),
    size,
  );
}
