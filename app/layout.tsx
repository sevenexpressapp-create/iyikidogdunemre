import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Manrope } from "next/font/google";
import { birthday } from "@/data/birthday";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: `İyi ki doğdun ${birthday.name}! 🎉`,
  description: `${birthday.name}, sana bir paket var. Aç bakalım içinden neler çıkacak 🎁`,
  openGraph: {
    title: `İyi ki doğdun ${birthday.name}! 🎉`,
    description: "Sana bir paket var. Aç bakalım içinden neler çıkacak 🎁",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0f0b1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${manrope.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
