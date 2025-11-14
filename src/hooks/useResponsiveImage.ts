"use client";
import { useEffect, useState } from "react";

/**
 * Hook to dynamically switch image sources based on viewport width
 * @param mobileSrc - Image source for mobile devices
 * @param desktopSrc - Image source for desktop devices
 * @param breakpoint - Breakpoint in pixels (default: 900px for 'md' breakpoint)
 * @returns The appropriate image source based on current viewport width
 */
export function useResponsiveImage(
  mobileSrc: string,
  desktopSrc: string,
  breakpoint = 900
): string {
  const [src, setSrc] = useState(desktopSrc);

  useEffect(() => {
    // Initial check
    const checkWidth = () => {
      setSrc(window.innerWidth < breakpoint ? mobileSrc : desktopSrc);
    };

    // Set initial value
    checkWidth();

    // Add resize listener
    window.addEventListener("resize", checkWidth);

    // Cleanup
    return () => window.removeEventListener("resize", checkWidth);
  }, [mobileSrc, desktopSrc, breakpoint]);

  return src;
}
