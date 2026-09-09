import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The node glyph reduced to fit a favicon. These hex values belong to the
 * mark, not the palette, and do not change when the palette does.
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
          gap: 4,
          background: "#0C1220",
          borderRadius: 6,
        }}
      >
        <div
          style={{ width: 10, height: 10, borderRadius: 5, background: "#FFB224" }}
        />
        <div style={{ width: 4, height: 2, background: "#94A2BD" }} />
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            border: "2px solid #3ADFC5",
          }}
        />
      </div>
    ),
    size,
  );
}
