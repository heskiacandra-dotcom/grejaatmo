// src/app/layout.tsx - updated to fix build error
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { PopupAnnouncement } from "@/components/ui/PopupAnnouncement";

export const viewport: Viewport = {
  themeColor: "#1A1614",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Paroki Keluarga Kudus Atmodirono",
    template: "%s | Paroki Keluarga Kudus Atmodirono",
  },
  description:
    "Website resmi Gereja Katolik Paroki Keluarga Kudus Atmodirono, Semarang. Informasi misa, berita paroki, warta, dan kegiatan jemaat.",
  keywords: [
    "gereja atmodirono",
    "paroki keluarga kudus",
    "misa semarang",
    "gereja katolik semarang",
  ],
  openGraph: {
    title: "Paroki Keluarga Kudus Atmodirono",
    description: "Website resmi Paroki Keluarga Kudus Atmodirono, Semarang.",
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/logo.png",
      },
    ],
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.png?v=1.1" />
        <link rel="apple-touch-icon" href="/logo.png?v=1.1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          <SmoothScroll>
            {children}
            <FloatingWhatsApp />
          </SmoothScroll>
          <PopupAnnouncement />
        </Providers>
      </body>
    </html>
  );
}
