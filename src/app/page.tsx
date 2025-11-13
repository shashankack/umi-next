import { AboutSection } from "@/sections/AboutSection";
import BestSellersSection from "@/sections/BestSellersSectionServer";
import HeroSection from "@/sections/HeroSection";
import InstagramSection from "@/sections/InstagramSection";
import SEOSection from "@/sections/SEOSection";
import React from "react";

const page = async () => {
  return (
    <>
      <HeroSection />
      <BestSellersSection />
      <AboutSection />
      <InstagramSection />
      <SEOSection />
    </>
  );
};

export default page;
