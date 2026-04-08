"use client";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

type SliderDirection = "left" | "right";

interface TextSliderProps {
  text?: string[];
  separator?: string;
  speed?: number;
  direction?: SliderDirection;
  pauseOnHover?: boolean;
  bgColor?: string;
  color?: string;
  fontSx?: SxProps<Theme>;
}

// const MIN_DURATION_SEC = 1;

const TextSlider = ({
  text = ["Text One", "Text Two"],
  separator = "•",
  speed = 1,
  direction = "left",
  pauseOnHover = true,
  bgColor = "secondary.main",
  color = "background.default",
  fontSx,
}: TextSliderProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const unitRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [repeatCount, setRepeatCount] = useState(2);

  const safeText = useMemo(() => {
    return text.filter((item) => item.trim().length > 0);
  }, [text]);

  const separatorLabel = useMemo(() => separator.trim(), [separator]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    const unit = unitRef.current;

    if (!wrapper || !track || !group || !unit || safeText.length === 0) {
      return;
    }

    const setupAnimation = () => {
      const wrapperWidth = wrapper.clientWidth;
      const unitWidth = unit.scrollWidth;

      if (unitWidth === 0 || wrapperWidth === 0) {
        return;
      }

      // Keep one cycle comfortably wider than the viewport so loop resets are off-screen.
      const nextRepeatCount = Math.max(
        2,
        Math.ceil((wrapperWidth * 1.5) / unitWidth),
      );
      if (nextRepeatCount !== repeatCount) {
        setRepeatCount(nextRepeatCount);
        return;
      }

      const groupWidth = group.scrollWidth;

      if (groupWidth === 0) {
        return;
      }

      tweenRef.current?.kill();

      const fromX = direction === "left" ? 0 : -groupWidth;
      const toX = direction === "left" ? -groupWidth : 0;

      gsap.set(track, { x: fromX });

      tweenRef.current = gsap.to(track, {
        x: toX,
        // duration: Math.max(speed / 1000, MIN_DURATION_SEC),
        duration: speed * (groupWidth / 100), // Duration based on speed and group width
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((value) => {
            return gsap.utils.wrap(-groupWidth, 0, Number.parseFloat(value));
          }),
        },
      });
    };

    setupAnimation();

    observerRef.current?.disconnect();
    observerRef.current = new ResizeObserver(() => {
      setupAnimation();
    });

    observerRef.current.observe(wrapper);
    observerRef.current.observe(group);

    const handleMouseEnter = () => {
      if (pauseOnHover) {
        tweenRef.current?.pause();
      }
    };

    const handleMouseLeave = () => {
      if (pauseOnHover) {
        tweenRef.current?.resume();
      }
    };

    if (pauseOnHover) {
      wrapper.addEventListener("mouseenter", handleMouseEnter);
      wrapper.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (pauseOnHover) {
        wrapper.removeEventListener("mouseenter", handleMouseEnter);
        wrapper.removeEventListener("mouseleave", handleMouseLeave);
      }

      observerRef.current?.disconnect();
      observerRef.current = null;
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [direction, pauseOnHover, repeatCount, safeText, speed]);

  if (safeText.length === 0) {
    return null;
  }

  return (
    <Box
      ref={wrapperRef}
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: bgColor,
        color,
      }}
    >
      <Box
        ref={trackRef}
        sx={{
          display: "flex",
          width: "max-content",
          willChange: "transform",
        }}
      >
        {[0, 1].map((loopIndex) => (
          <Box
            key={loopIndex}
            ref={loopIndex === 0 ? groupRef : undefined}
            aria-hidden={loopIndex === 1}
            sx={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              flexShrink: 0,
              py: { xs: 1.25, sm: 0.9 },
            }}
          >
            {Array.from({ length: repeatCount }).map((_, repeatIndex) => (
              <Box
                key={`${loopIndex}-repeat-${repeatIndex}`}
                ref={loopIndex === 0 && repeatIndex === 0 ? unitRef : undefined}
                sx={{ display: "inline-flex", alignItems: "center" }}
              >
                {safeText.map((item, index) => (
                  <Box
                    key={`${loopIndex}-${repeatIndex}-${item}-${index}`}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 0.65 },
                      px: { xs: 0.75, sm: 1 },
                      ...fontSx,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 400,
                        fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        cursor: "default",
                        lineHeight: 1,
                        fontFamily: "Inter, sans-serif",
                        color: "#000",
                      }}
                    >
                      {item}
                    </Typography>
                    {separatorLabel ? (
                      <Box
                        component="span"
                        aria-hidden
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          opacity: 0.75,
                          lineHeight: 1,
                          fontSize: { xs: "0.75rem", sm: "2rem" },
                          transform: "translate(0.15em, -0.10em)",
                            color: "#000",
                        }}
                      >
                        {separatorLabel}
                      </Box>
                    ) : null}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export type { TextSliderProps };
export default TextSlider;
