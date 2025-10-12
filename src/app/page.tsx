import { AboutSection } from "@/sections/AboutSection";
import BestSellersSection from "@/sections/BestSellersSectionServer";
import HeroSection from "@/sections/HeroSection";
import InstagramSection from "@/sections/InstagramSection";
import React from "react";

const page = async () => {
  return (
    <>
      <HeroSection />
      <BestSellersSection />
      <AboutSection />
      <InstagramSection />
    </>
  );
};

export default page;
