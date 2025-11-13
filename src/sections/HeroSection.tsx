"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, useTheme, useMediaQuery } from "@mui/material";
import { gsap } from "gsap";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const introContainerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const cloudRef = useRef(null);
  const monogramRef = useRef(null);
  const colorAnimationRef = useRef<gsap.core.Tween | null>(null);

  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("hasPlayed") === "true";

    if (hasPlayed) {
      gsap.set(introContainerRef.current, { display: "none" });
      gsap.set(videoContainerRef.current, { y: "0vh" });
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    gsap.set(videoContainerRef.current, { y: "100vh" });
    gsap.set(cloudRef.current, { scale: 30 });
    gsap.set(monogramRef.current, { scale: 0 });

    // Track all assets that need to be loaded
    const trackAssetLoading = async () => {
      const assetsToLoad: Promise<void>[] = [];

      // Track logo images
      const cloudImg = new Image();
      cloudImg.src = "/images/icons/empty_cloud.png";
      assetsToLoad.push(
        new Promise((resolve) => {
          cloudImg.onload = () => resolve();
          cloudImg.onerror = () => resolve();
        })
      );

      const monogramImg = new Image();
      monogramImg.src = "/images/icons/pink_monogram.png";
      assetsToLoad.push(
        new Promise((resolve) => {
          monogramImg.onload = () => resolve();
          monogramImg.onerror = () => resolve();
        })
      );

      // Track video
      const video = document.createElement("video");
      // video.src = isMobile
      //   ? "/videos/mobile_intro.mp4"
      //   : "/videos/desktop_intro.mp4";
      video.src = "/videos/intro.mp4";
      assetsToLoad.push(
        new Promise((resolve) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => resolve();
        })
      );

      // Track fonts
      if (document.fonts) {
        assetsToLoad.push(document.fonts.ready.then(() => {}).catch(() => {}));
      }

      // Wait for all assets to load
      await Promise.all(assetsToLoad);

      // Wait an extra 2 seconds to ensure everything is loaded
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAssetsLoaded(true);
    };

    trackAssetLoading();

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      if (colorAnimationRef.current) {
        colorAnimationRef.current.kill();
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (!assetsLoaded) return;

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
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
        sessionStorage.setItem("hasPlayed", "true");
      });
  }, [assetsLoaded]);

  useEffect(() => {
    // Initial animation: logo and monogram fly in
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
  }, [assetsLoaded]);

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
              top: "37%",
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
          component="video"
          autoPlay
          loop
          muted
          playsInline
          src={
            "/videos/intro.mp4"
          }
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
