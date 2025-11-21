// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import ThemeRegistry from "@/components/ThemeRegistry";
import { CartProvider } from "@/context/CartContext";
import { Metadata } from "next";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/structuredData";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalLoader from "@/components/GlobalLoader";

export const metadata: Metadata = {
  metadataBase: new URL('https://umimatchashop.com'),
  title: {
    default: "Umi Matcha - Best Organic Matcha from Japan in India",
    template: "%s | Umi Matcha",
  },
  description: "Premium organic matcha from 300+ year old farms in Wazuka, Japan. Kinder rituals that fill your cup. Shop ceremonial grade matcha, matcha accessories, and bundles.",
  keywords: [
    "matcha",
    "organic matcha",
    "Japanese tea",
    "green tea",
    "Umi Matcha",
    "India",
    "ceremonial matcha",
    "matcha powder",
    "matcha tea",
    "buy matcha online",
    "premium matcha",
    "Wazuka matcha",
  ],
  authors: [{ name: "Umi Matcha" }],
  creator: "Umi Matcha",
  publisher: "Umi Matcha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://umimatchashop.com",
    siteName: "Umi Matcha",
    title: "Umi Matcha - Best Organic Matcha from Japan in India",
    description: "Premium organic matcha from 300+ year old farms in Wazuka, Japan. Kinder rituals that fill your cup.",
    images: [
      {
        url: "/images/icons/pink_logo.png",
        width: 1200,
        height: 630,
        alt: "Umi Matcha Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umi Matcha - Best Organic Matcha from Japan in India",
    description: "Premium organic matcha from 300+ year old farms in Wazuka, Japan. Kinder rituals that fill your cup.",
    images: ["/images/icons/pink_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#B5D782" />
        
        {/* Preload critical fonts to prevent reloading on every page */}
        <link
          rel="preload"
          href="/fonts/bricolage.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/gliker_sb.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/stolzl.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Genty.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <ThemeRegistry>
          <CartProvider>
            <GlobalLoader />
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
