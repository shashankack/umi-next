"use client";
import React, { useEffect, useRef } from "react";
import { Box, Stack, useTheme, useMediaQuery } from "@mui/material";
import { gsap } from "gsap";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const introContainerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const cloudRef = useRef(null);
  const monogramRef = useRef(null);

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

    const tl = gsap.timeline();

    tl.to(cloudRef.current, {
      scale: 1,
      duration: 0.8,
      ease: "back.out(.6)",
    })

      .to(monogramRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "back.out(2)",
      })

      .to(introContainerRef.current, {
        y: "-100vh",
        duration: 1.2,
        ease: "power2.inOut",
        delay: 0.6,
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

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, []);

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
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p={2}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 4000,
        }}
      >
        <Box
          ref={cloudRef}
          component="img"
          src="/images/icons/empty_cloud.png"
          sx={{
            position: "relative",
            width: { xs: "40vw", sm: "11vw" },
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
            width: { xs: "20vw", sm: "6vw" },
          }}
        />
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
            isMobile ? "/videos/mobile_intro.mp4" : "/videos/desktop_intro.mp4"
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
