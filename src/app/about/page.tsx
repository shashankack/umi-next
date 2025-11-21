import React from "react";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/seo";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Umi Matcha | Our Story & Mission",
  description:
    "Discover the story behind Umi Matcha. We source premium ceremonial matcha from Wazuka, Japan's premier matcha region, partnering with 300+ year old certified organic tea farms to bring authentic Japanese matcha culture to you.",
  keywords: [
    "about Umi Matcha",
    "matcha company",
    "Japanese tea culture",
    "organic matcha farm",
    "Wazuka matcha region",
    "ceremonial matcha story",
    "sustainable tea farming",
  ],
  alternates: {
    canonical: getCanonicalUrl("about"),
  },
  openGraph: {
    title: "About Umi Matcha | Our Story & Mission",
    description:
      "Discover the story behind Umi Matcha. We source premium ceremonial matcha from Wazuka, Japan's premier matcha region.",
    url: getCanonicalUrl("about"),
    siteName: "Umi Matcha",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og/about.png",
        width: 1200,
        height: 630,
        alt: "About Umi Matcha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Umi Matcha | Our Story & Mission",
    description:
      "Discover the story behind Umi Matcha. We source premium ceremonial matcha from Wazuka, Japan.",
    images: ["/images/og/about.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
