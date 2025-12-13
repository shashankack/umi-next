"use client";
import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import IntroAnimation from "@/components/IntroAnimation";

const HeroSection = () => {
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Check if intro has already been played
  const hasPlayed = useMemo(() => 
    typeof window !== "undefined" && sessionStorage.getItem("hasPlayed") === "true",
    []
  );

  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  // Ensure video keeps playing when scrolling back to top
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is visible, ensure it's playing
            videoElement.play().catch(() => {
              // Ignore play errors (e.g., if already playing)
            });
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
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
          ref={videoRef}
          component="video"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          src="/videos/intro.mp4"
          onCanPlay={handleVideoCanPlay}
          onLoadedData={handleVideoCanPlay}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#B5D782",
          }}
        />
      </Box>
    </>
  );
};

export default HeroSection;