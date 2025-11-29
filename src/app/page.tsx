import HeroSection from "@/sections/HeroSection";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/seo";

import InstagramSection from "@/sections/InstagramSection";

export const metadata: Metadata = {
  title: "Umi Matcha | Premium Organic Ceremonial Matcha from Japan",
  description:
    "Experience the finest ceremonial matcha from Wazuka, Japan's premier matcha region. Ethically sourced from 300+ year old certified organic tea farms. Shop premium matcha powder, whisks, bowls, and accessories.",
  keywords: [
    "ceremonial matcha",
    "organic matcha powder",
    "Japanese matcha",
    "matcha tea",
    "ceremonial grade matcha",
    "Wazuka matcha",
    "matcha accessories",
    "matcha whisk",
    "matcha bowl",
    "premium matcha",
  ],
  alternates: {
    canonical: getCanonicalUrl(""),
  },
  openGraph: {
    title: "Umi Matcha | Premium Organic Ceremonial Matcha from Japan",
    description:
      "Experience the finest ceremonial matcha from Wazuka, Japan's premier matcha region. Ethically sourced from 300+ year old certified organic tea farms.",
    url: getCanonicalUrl(""),
    siteName: "Umi Matcha",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og/home.png",
        width: 1200,
        height: 630,
        alt: "Umi Matcha - Premium Organic Ceremonial Matcha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umi Matcha | Premium Organic Ceremonial Matcha from Japan",
    description:
      "Experience the finest ceremonial matcha from Wazuka, Japan. Ethically sourced from 300+ year old certified organic tea farms.",
    images: ["/images/og/home.png"],
  },
};
// Lazy load sections below the fold to improve FCP
// These sections won't block the initial render of HeroSection
const BestSellersSection = dynamic(
  () => import("@/sections/BestSellersSectionServer"),
  {
    loading: () => null, // or a skeleton loader
  }
);

const AboutSection = dynamic(
  () => import("@/sections/AboutSection").then((mod) => mod.AboutSection),
  {
    loading: () => null,
  }
);

const SEOSection = dynamic(() => import("@/sections/SEOSection"), {
  loading: () => null,
});

const page = async () => {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <HeroSection />
      <BestSellersSection />
      <AboutSection />
      <InstagramSection />
      <SEOSection />
    </>
  );
};

export default page;
