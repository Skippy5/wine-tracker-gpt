import { ImageResponse } from "next/og";

export const alt = "Pour Choices wine club cellar log";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fffaf5",
          color: "#2d0a1a",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 82px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
          <div
            style={{
              alignItems: "center",
              background: "#5d1835",
              borderRadius: 28,
              color: "white",
              display: "flex",
              fontSize: 34,
              fontWeight: 800,
              height: 86,
              justifyContent: "center",
              width: 86,
            }}
          >
            PC
          </div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>Pour Choices</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#913454", fontSize: 24, fontWeight: 800, letterSpacing: 5, textTransform: "uppercase" }}>
            Wine club cellar
          </div>
          <div style={{ fontFamily: "serif", fontSize: 88, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02, maxWidth: 850 }}>
            Track every pour from must to bottle.
          </div>
        </div>
        <div style={{ color: "#6f6264", display: "flex", fontSize: 24, gap: 30 }}>
          <span>Meetings</span><span>•</span><span>Batches</span><span>•</span><span>Readings</span><span>•</span><span>Additions</span>
        </div>
      </div>
    ),
    size,
  );
}
