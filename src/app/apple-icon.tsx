import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#5d1835",
          borderRadius: 40,
          color: "#fffaf5",
          display: "flex",
          fontSize: 72,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: -6,
          width: "100%",
        }}
      >
        PC
      </div>
    ),
    size,
  );
}
