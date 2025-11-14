"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, useTheme, useMediaQuery } from "@mui/material";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const introContainerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const cloudRef = useRef(null);
  const monogramRef = useRef(null);
  const colorAnimationRef = useRef<any>(null);

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("hasPlayed") === "true";

    if (hasPlayed) {
      import("gsap").then((gsap) => {
        gsap.default.set(introContainerRef.current, { display: "none" });
        gsap.default.set(videoContainerRef.current, { y: "0vh" });
      });
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    // Dynamic import GSAP
    import("gsap").then((gsap) => {
      gsap.default.set(videoContainerRef.current, { y: "100vh" });
      gsap.default.set(cloudRef.current, { scale: 30 });
      gsap.default.set(monogramRef.current, { scale: 0 });
    });

    // Wait for video to be ready to play
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleCanPlay = () => {
        setVideoLoaded(true);
      };

      videoElement.addEventListener("canplaythrough", handleCanPlay);

      // Fallback: if video doesn't load in 5 seconds, continue anyway
      const fallbackTimer = setTimeout(() => {
        setVideoLoaded(true);
      }, 5000);

      return () => {
        videoElement.removeEventListener("canplaythrough", handleCanPlay);
        clearTimeout(fallbackTimer);
      };
    }
  }, [isMobile]);

  // Start intro animation once video is loaded
  useEffect(() => {
    if (!videoLoaded) return;

    // Brief delay before starting intro animation
    const timer = setTimeout(() => {
      setAssetsLoaded(true);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [videoLoaded]);

  useEffect(() => {
    if (!assetsLoaded) return;

    // Dynamic import GSAP for animations
    import("gsap").then(({ default: gsap }) => {
      // Kill the color animation when assets are loaded
      if (colorAnimationRef.current) {
        colorAnimationRef.current.kill();
      }

      const tl = gsap.timeline();

      tl.to(introContainerRef.current, {
        y: "-100vh",
        duration: 1.2,
        ease: "power2.inOut",
        delay: 0.3,
      })
        .to(
          videoContainerRef.current,
          {
            y: "0vh",
            duration: 1.2,
            ease: "power2.inOut",
          },
          "-=1.2"
        )
        .call(() => {
          gsap.set(introContainerRef.current, { display: "none" });
          document.body.style.overflow = "";
          document.body.style.height = "";
          document.body.style.position = "";
          document.body.style.width = "";
          sessionStorage.setItem("hasPlayed", "true");
        });
    });
  }, [assetsLoaded]);

  useEffect(() => {
    // Initial animation: logo and monogram fly in - only run once on mount
    import("gsap").then(({ default: gsap }) => {
      const initialTl = gsap.timeline({
        onComplete: () => {
          // After logo animation, start color cycling if assets aren't loaded yet
          if (!assetsLoaded && introContainerRef.current) {
            colorAnimationRef.current = gsap.to(introContainerRef.current, {
              backgroundColor: "#B5D782", // Green color
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }
        },
      });

      initialTl
        .to(cloudRef.current, {
          scale: 1,
          duration: 0.8,
          ease: "back.out(.6)",
        })
        .to(monogramRef.current, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <Stack
      sx={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Intro Section */}
      <Box
        ref={introContainerRef}
        className="intro-container"
        height="100vh"
        bgcolor="primary.main"
        p={2}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 4000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
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
            ref={cloudRef}
            component="img"
            src="/images/icons/empty_cloud.png"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <Box
            ref={monogramRef}
            component="img"
            src="/images/icons/pink_monogram.png"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "55%", sm: "60%" },
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      {/* Video Section */}
      <Box
        ref={videoContainerRef}
        className="video-container"
        height="100vh"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <Box
          ref={videoRef}
          component="video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={"/videos/intro.mp4"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
    </Stack>
  );
};

export default HeroSection;
