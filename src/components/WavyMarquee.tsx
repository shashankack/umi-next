"use client";

import Box from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useMediaQuery, useTheme } from "@mui/material";

type WavyMarqueeProps = {
  speed?: number; // animation duration in seconds
  direction?: "left" | "right";
  fontSize?: string | number;
  height?: string | number | object | undefined;
};

const WavyMarquee: React.FC<WavyMarqueeProps> = ({
  speed = 15,
  direction = "left",
  fontSize,
  height,
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Dynamically repeat text to fill the path for seamless looping
  const [singleTextLen, setSingleTextLen] = useState(0);
  // Always render 4 copies for seamless loop
  const textCopies = 4;
  useEffect(() => {
    if (!pathRef.current || !textPathRef.current) return;
    // Render one copy, measure its length
    setTimeout(() => {
      if (textPathRef.current) {
        setSingleTextLen(
          textPathRef.current.getComputedTextLength() / textCopies
        );
      }
    }, 50);
  }, [fontSize, isMobile]);

  useEffect(() => {
    if (!textPathRef.current || !singleTextLen) return;
    // Animate startOffset from 0 to -3*singleTextLen (left) or 3*singleTextLen (right)
    let anim: gsap.core.Tween | undefined;
    const from = 0;
    const to = direction === "right" ? 3 * singleTextLen : -3 * singleTextLen;
    function loop() {
      anim = gsap.fromTo(
        textPathRef.current,
        { attr: { startOffset: from } },
        {
          attr: { startOffset: to },
          duration: speed * 3,
          ease: "none",
          onComplete: loop,
        }
      );
    }
    loop();
    return () => {
      if (anim) anim.kill();
    };
  }, [direction, speed, singleTextLen]);

  const textString =
    "* matcha your flow * matcha your flow * matcha your flow ";

  return (
    <Box width="100%" overflow="hidden" bgcolor="transparent">
      <Box
        component="svg"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{ width: "100%", ...(height ? { height } : {}) }}
      >
        <defs>
          {/* This path defines both the centerline and the text path */}
          <path
            id="curve"
            ref={pathRef}
            d="M0,130 C500,0 700,200 1200,100"
            fill="none"
          />
        </defs>

        {/* The wave background (thick stroke) */}
        <use
          href="#curve"
          stroke="#f79995"
          strokeWidth={isMobile ? 40 : 80}
          fill="none"
          strokeLinecap="round"
        />

        {/* The text exactly along the center of the stroke */}
        <text dy={isMobile ? "7" : "10"}>
          <Box
            component="textPath"
            ref={textPathRef}
            href="#curve"
            startOffset="0"
            spacing="auto"
            sx={{
              letterSpacing: { xs: "2px", md: ".5px" },
              fontSize,
              fill: "#FDF8CE",
              textTransform: "lowercase",
              fontFamily: "Stolzl, sans-serif",
            }}
          >
            {Array.from({ length: textCopies })
              .map(() => textString)
              .join("")}
          </Box>
        </text>
      </Box>
    </Box>
  );
};

export default WavyMarquee;
