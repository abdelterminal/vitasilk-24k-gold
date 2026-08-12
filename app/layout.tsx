import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Reem_Kufi, Tajawal } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import { SITE_URL } from "@/lib/config";
import ogImage from "@/assets/images/studio-front.webp";
import "./globals.css";

// High stroke contrast reads far more luxe on ivory than the sibling project's
// Marcellus. Swap this import + variable back if a lower-contrast serif is wanted.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  weight: ["300", "400", "500", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vitasilk 24K Gold — Lissage Professionnel 1L | ليساج احترافي بالذهب",
  description:
    "Vitasilk 24K Gold 1L — lissage professionnel sans acide glyoxylique ni formol. Or 24 carats, kératine, collagène et huile de coco pour des cheveux lisses, brillants et nourris. Livraison gratuite au Maroc, paiement à la livraison.",
  openGraph: {
    title: "Vitasilk 24K Gold — Lissage Professionnel 1L",
    description:
      "Sans acide glyoxylique, sans formol. Or 24 carats, kératine et collagène pour un lissage parfait et durable. Livraison gratuite au Maroc — paiement à la livraison.",
    // dimensions come from the file, so they cannot drift out of sync with it
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height }],
    locale: "ar_MA",
    alternateLocale: "fr_MA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cormorant.variable} ${jost.variable} ${reemKufi.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
