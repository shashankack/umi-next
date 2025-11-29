"use client";
import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Image from "next/image";
import { motion, useAnimate } from "framer-motion";

interface IntroAnimationProps {
  nextSection: React.RefObject<HTMLDivElement | null>;
  videoReady: boolean;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({
  nextSection,
  videoReady,
}) => {
  const theme = useTheme();
  const [scopeIntro, animateIntro] = useAnimate();
  const [scopeCloud, animateCloud] = useAnimate();
  const [scopeMonogram, animateMonogram] = useAnimate();
  const [scopeNext, animateNext] = useAnimate();

  // Check immediately to avoid flash of intro screen
  const hasPlayed =
    typeof window !== "undefined" &&
    sessionStorage.getItem("hasPlayed") === "true";
  const [isComplete, setIsComplete] = useState(hasPlayed);

  useEffect(() => {
    if (hasPlayed) {
      if (nextSection.current) {
        nextSection.current.style.transform = "translateY(0)";
      }
      return;
    }

    // Lock scroll
    document.body.style.overflow = "hidden";

    // Start preloading resources immediately
    const preloadResources = () => {
      // Preload hero video
      const videoLink = document.createElement('link');
      videoLink.rel = 'preload';
      videoLink.as = 'video';
      videoLink.href = '/videos/intro.mp4';
      document.head.appendChild(videoLink);

      // Preload critical images
      const criticalImages = [
        '/images/vectors/mobile_text.svg',
        '/images/vectors/text.svg',
        '/images/neko/surfing.png',
      ];

      criticalImages.forEach(src => {
        const img = new window.Image();
        img.src = src;
      });

      // Prefetch fonts if not already loaded
      if (document.fonts) {
        document.fonts.ready.then(() => {
          console.log('Fonts loaded');
        });
      }
    };

    // Start preloading immediately
    preloadResources();

    const runAnimation = async () => {
      // Initial delay before animation starts - give time for initial resource loading
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Cloud stamps down
      await animateCloud(
        scopeCloud.current,
        { scale: 1, x: "-50%", y: "-50%", opacity: 1 },
        {
          duration: 0.6,
          delay: 0,
          ease: [0.22, 1, 0.36, 1.06],
          type: "tween",
        }
      );

      // Monogram scales in with overshoot
      await animateMonogram(
        scopeMonogram.current,
        { scale: 1, x: "-50%", y: "-50%" },
        {
          delay: 0,
          duration: 0.6,
          ease: [0.175, 0.885, 0.32, 1.475],
          type: "tween",
        }
      );

      // Pulse background colors while waiting for video
      let pulseCount = 0;
      const maxPulses = 4; // Allow 4 pulses (4.8 seconds) for resource loading
      
      while (!videoReady && pulseCount < maxPulses) {
        // Pulse to green
        await animateIntro(
          scopeIntro.current,
          { backgroundColor: "#B5D782" },
          { duration: 0.6, ease: "easeInOut" }
        );
        
        if (!videoReady && pulseCount < maxPulses - 1) {
          // Pulse back to pink
          await animateIntro(
            scopeIntro.current,
            { backgroundColor: "#F6A09E" },
            { duration: 0.6, ease: "easeInOut" }
          );
        }
        
        pulseCount++;
      }

      // Video is ready (or timeout), transition to primary color
      await animateIntro(
        scopeIntro.current,
        { backgroundColor: theme.palette.primary.main },
        { duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }
      );

      // Slide intro up and nextSection into view simultaneously
      const animations = [
        animateIntro(
          scopeIntro.current,
          { y: "-100vh" },
          { duration: 0.9, ease: [0.455, 0.03, 0.515, 0.955] }
        ),
      ];

      if (nextSection.current) {
        animations.push(
          animateNext(
            nextSection.current,
            { y: 0 },
            { duration: 0.9, ease: [0.455, 0.03, 0.515, 0.955] }
          )
        );
      }

      await Promise.all(animations);

      // Mark as played and unlock scroll
      sessionStorage.setItem("hasPlayed", "true");
      document.body.style.overflow = "";
      setIsComplete(true);
    };

    runAnimation();
  }, [
    videoReady,
    nextSection,
    theme.palette.primary.main,
    animateIntro,
    animateCloud,
    animateMonogram,
    animateNext,
    scopeIntro,
    scopeCloud,
    scopeMonogram,
  ]);

  if (isComplete) return null;

  return (
    <Box
      ref={scopeIntro}
      component={motion.div}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "100vh",
        zIndex: 9999,
        bgcolor: "secondary.main",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "40vw", sm: "11vw" },
          height: { xs: "40vw", sm: "11vw" },
        }}
      >
        <Box
          ref={scopeCloud}
          component={motion.div}
          initial={{ scale: 26, x: "-50%", y: "-50%", opacity: 0 }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            willChange: "transform",
          }}
        >
          <Image
            src="/images/icons/empty_cloud.png"
            alt="Umi Cloud Logo"
            fill
            priority
            fetchPriority="high"
            style={{ objectFit: "contain" }}
            sizes="(max-width: 600px) 40vw, 11vw"
          />
        </Box>
        <Box
          ref={scopeMonogram}
          component={motion.div}
          initial={{ scale: 0, x: "-50%", y: "-50%" }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: { xs: "65%", sm: "60%" },
            height: "auto",
            willChange: "transform",
          }}
        >
          <Image
            src="/images/icons/pink_monogram.png"
            alt="Umi Monogram"
            width={200}
            height={200}
            priority
            fetchPriority="high"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
            sizes="(max-width: 600px) 22vw, 6.6vw"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default IntroAnimation;
