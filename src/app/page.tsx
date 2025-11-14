import HeroSection from "@/sections/HeroSection";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";

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

const InstagramSection = dynamic(() => import("@/sections/InstagramSection"), {
  loading: () => null,
});

const SEOSection = dynamic(() => import("@/sections/SEOSection"), {
  loading: () => null,
});

const page = async () => {
  return (
    <>
      <SpeedInsights />
      <HeroSection />
      <BestSellersSection />
      <AboutSection />
      <InstagramSection />
      <SEOSection />\
    </>
  );
};

export default page;
