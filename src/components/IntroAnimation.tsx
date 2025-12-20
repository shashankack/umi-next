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
      // Preload critical images
      const criticalImages = [
        "/images/vectors/mobile_text.svg",
        "/images/vectors/text.svg",
        "/images/neko/surfing.png",
      ];

      criticalImages.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });

      // Prefetch fonts if not already loaded
      if (document.fonts) {
        document.fonts.ready.catch(() => {});
      }
    };

    // Start preloading immediately
    preloadResources();

    const runAnimation = async () => {
      // Cloud stamps down with smooth back.out easing - START IMMEDIATELY
      await animateCloud(
        scopeCloud.current,
        { scale: 1, x: "-50%", y: "-50%", opacity: 1 },
        {
          duration: 1,
          delay: 0,
          ease: [0.175, 0.885, 0.32, 1.275], // back.out easing
          type: "tween",
        }
      );

      // Monogram scales in with smooth bounce
      await animateMonogram(
        scopeMonogram.current,
        { scale: 1, x: "-50%", y: "-50%" },
        {
          delay: 0,
          duration: 0.8,
          ease: [0.68, 1.55, 0.265, 1.55], // Smooth elastic ease
          type: "tween",
        }
      );

      // Now wait for fonts to be ready while pulsing colors
      const fontsLoaded = document.fonts ? document.fonts.ready : Promise.resolve();
      let fontCheckComplete = false;
      
      fontsLoaded.then(() => {
        fontCheckComplete = true;
      }).catch(() => {
        fontCheckComplete = true;
      });

      // Pulse background colors while waiting for video AND fonts - 2 second duration per color
      let pulseCount = 0;
      const maxPulses = 1; // Max 4 seconds wait time (2s green + 2s pink)

      while ((!videoReady || !fontCheckComplete) && pulseCount < maxPulses) {
        // Pulse to green with smooth ease - 2 second duration
        await animateIntro(
          scopeIntro.current,
          { backgroundColor: "#B5D782" },
          { duration: 1.5, ease: [0.45, 0, 0.55, 1] }
        );

        if ((!videoReady || !fontCheckComplete) && pulseCount < maxPulses - 1) {
          // Pulse back to pink - 2 second duration
          await animateIntro(
            scopeIntro.current,
            { backgroundColor: "#F6A09E" },
            { duration: 1.5, ease: [0.45, 0, 0.55, 1] }
          );
        }

        pulseCount++;
      }

      // Video is ready, transition to primary color smoothly
      await animateIntro(
        scopeIntro.current,
        { backgroundColor: theme.palette.primary.main },
        { duration: 0.6, ease: [0.4, 0, 0.2, 1] } // Material Design easing
      );

      // Slide intro up with buttery smooth transition
      const animations = [
        animateIntro(
          scopeIntro.current,
          { y: "-100vh" },
          { duration: 1.2, ease: [0.83, 0, 0.17, 1] } // Ultra-smooth power4.out
        ),
      ];

      if (nextSection.current) {
        animations.push(
          animateNext(
            nextSection.current,
            { y: 0 },
            { duration: 1.2, ease: [0.83, 0, 0.17, 1] } // Matching smooth ease
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
          initial={{ scale: 4, x: "-50%", y: "-50%", opacity: 0 }}
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
            src="/images/icons/empty_cloud.svg"
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
            src="/images/icons/pink_monogram.svg"
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
