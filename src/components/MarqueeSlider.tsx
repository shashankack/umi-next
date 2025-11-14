"use client";

import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

interface MarqueeSliderProps {
  text?: string;
  speed?: number;
  direction?: "left" | "right";
  color?: string;
  fontSize?: string | number | { [key: string]: string | number };
}

export default function MarqueeSlider({
  text = "shop •",
  speed = 50,
  direction = "left",
  color = "#FDF8CE",
  fontSize,
}: MarqueeSliderProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current || !contentRef.current) return;

    const contentElement = contentRef.current;

    // Get the width of a single text instance
    const contentWidth = contentElement.offsetWidth;

    // Calculate duration based on speed (lower number = faster)
    const duration = contentWidth / speed;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let animation: any;

    // Dynamically import GSAP
    import("gsap").then(({ default: gsap }) => {
      // Set initial position
      gsap.set(contentElement, { x: 0 });

      // Create the infinite loop animation
      animation = gsap.to(contentElement, {
        x: direction === "left" ? -contentWidth / 2 : contentWidth / 2,
        duration: duration,
        ease: "none",
        repeat: -1,
      });
    });

    return () => {
      if (animation) animation.kill();
    };
  }, [speed, direction, text]);

  // Duplicate the text multiple times to ensure seamless loop
  const repeatedText = `${text} `.repeat(20);

  return (
    <Box
      ref={marqueeRef}
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      <Box ref={contentRef} sx={{ display: "inline-block" }}>
        <Typography
          component="span"
          sx={{
            display: "inline-block",
            color: color,
            fontSize,
          }}
        >
          {repeatedText}
        </Typography>
        <Typography
          component="span"
          sx={{
            display: "inline-block",
            color: color,
            fontSize,
          }}
        >
          {repeatedText}
        </Typography>
      </Box>
    </Box>
  );
}
