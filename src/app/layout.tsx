import type { Metadata, Viewport } from "next";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Pour Choices",
  title: {
    default: "Pour Choices · Wine Club Cellar",
    template: "%s · Pour Choices",
  },
  description: "A delightfully organized cellar log for Pour Choices wine club meetings, batches, readings, and additions.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pour Choices",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Pour Choices · Wine Club Cellar",
    description: "Track every batch from first pour to final bottle.",
    siteName: "Pour Choices",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fffaf5",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="h-full antialiased" lang="en">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
