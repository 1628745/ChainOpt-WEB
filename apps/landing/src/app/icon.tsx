import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The cut-edge glyph at favicon size, drawn as the same paths the wordmark
 * uses so the two cannot drift apart. These hex values belong to the mark, not
 * the palette, and do not change when the palette does.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C1220",
          borderRadius: 6,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M7.6 7.9 15.6 10.8"
            stroke="#3ADFC5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7.6 16.1 9.9 15.3M13.4 14.0 15.6 13.2"
            stroke="#94A2BD"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="5" cy="6.6" r="2.6" stroke="#3ADFC5" strokeWidth="2" />
          <circle cx="5" cy="17.4" r="2.6" stroke="#94A2BD" strokeWidth="2" />
          <circle cx="19" cy="12" r="3" fill="#FFB224" />
        </svg>
      </div>
    ),
    size,
  );
}
