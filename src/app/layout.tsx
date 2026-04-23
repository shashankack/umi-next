// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import ThemeRegistry from "@/components/ThemeRegistry";
import { CartProvider } from "@/context/CartContext";
import { Metadata } from "next";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/structuredData";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GlobalLoader = dynamic(() => import("@/components/GlobalLoader"));

export const metadata: Metadata = {
  metadataBase: new URL("https://www.umimatchashop.com"),
  title: {
    default: "Umi Matcha - Best Organic Matcha from Japan in India",
    template: "%s | Umi Matcha",
  },
  description:
    "Premium organic matcha from 300+ year old farms in Wazuka, Japan. Kinder rituals that fill your cup. Shop ceremonial grade matcha, matcha accessories, and bundles.",
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
    url: "https://www.umimatchashop.com",
    siteName: "Umi Matcha",
    title: "Umi Matcha - Best Organic Matcha from Japan in India",
    description:
      "Premium organic matcha from 300+ year old farms in Wazuka, Japan. Kinder rituals that fill your cup.",
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
    description:
      "Premium organic matcha from 300+ year old farms in Wazuka, Japan. Kinder rituals that fill your cup.",
    images: ["/images/icons/pink_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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

        {/* Preload all critical fonts to prevent FOUT */}
        <link
          rel="preload"
          href="/fonts/bricolage.ttf"
          as="font"
          type="font/ttf"
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
          href="/fonts/gliker_sb.woff2"
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
        <link
          rel="preconnect"
          href="https://vercel.live"
          crossOrigin="anonymous"
        />

        {/* Defer non-critical resources */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '801240169709340');
              fbq('track', 'PageView');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var KEY = 'umi_tracking_params';
                  var DEBUG_KEY = 'umi_tracking_debug';
                  var KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ttclid','msclkid','gbraid','wbraid'];
                  var params = new URLSearchParams(window.location.search);
                  var existing = JSON.parse(localStorage.getItem(KEY) || '{}');
                  var updated = false;
                  var debug = params.get('umi_track_debug');

                  if (debug === '1' || debug === 'true') {
                    localStorage.setItem(DEBUG_KEY, '1');
                  } else if (debug === '0' || debug === 'false') {
                    localStorage.removeItem(DEBUG_KEY);
                  }

                  KEYS.forEach(function(k) {
                    var v = params.get(k);
                    if (v) {
                      existing[k] = v;
                      updated = true;
                    }
                  });

                  if (updated) {
                    localStorage.setItem(KEY, JSON.stringify(existing));
                  }
                } catch (e) {
                  // no-op
                }
              })();
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=801240169709340&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
