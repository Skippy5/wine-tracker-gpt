import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pour Choices Wine Club Cellar",
    short_name: "Pour Choices",
    description: "Track wine club meetings, batches, readings, and additions.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf5",
    theme_color: "#5d1835",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
