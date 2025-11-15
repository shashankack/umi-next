"use client";
import React, { useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import IntroAnimation from "@/components/IntroAnimation";

const HeroSection = () => {
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Check if intro has already been played
  const hasPlayed = typeof window !== "undefined" && sessionStorage.getItem("hasPlayed") === "true";

  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  return (
    <>
      <IntroAnimation 
        nextSection={videoSectionRef} 
        videoReady={videoLoaded}
      />
      
      <Box
        ref={videoSectionRef}
        component={motion.div}
        initial={{ y: hasPlayed ? 0 : "100vh" }}
        sx={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          component="video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/videos/intro.mp4"
          onCanPlay={handleVideoCanPlay}
          onLoadedData={handleVideoCanPlay}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
    </>
  );
};

export default HeroSection;