import { AboutSection } from "@/sections/AboutSection";
import BestSellersSection from "@/sections/BestSellersSectionServer";
import HeroSection from "@/sections/HeroSection";
import InstagramSection from "@/sections/InstagramSection";
import SEOSection from "@/sections/SEOSection";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
