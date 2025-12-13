"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Preload the cat icon on idle
  useEffect(() => {
    const preloadIcon = () => {
      const img = new window.Image();
      img.src = "/images/neko/slider_thumb.png";
      img.onload = () => setIsReady(true);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadIcon);
    } else {
      setTimeout(preloadIcon, 100);
    }
  }, []);

  useEffect(() => {
    // Wait for page to be fully rendered before hiding loader
    const handleComplete = () => {
      // Small delay to ensure content is painted
      setTimeout(() => {
        setLoading(false);
      }, 100);
    };

    // Reset loading state when navigation completes
    handleComplete();
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Handle navigation start
    const handleStart = () => {
      setLoading(true);
      // Failsafe: auto-hide loader after 5 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 5000);
    };

    // Listen for custom route change events (from Link clicks, router.push, etc.)
    window.addEventListener('routeChangeStart', handleStart);

    // Listen for clicks on anchor tags (fallback for direct <a> usage)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const currentPath = window.location.pathname;
        
        // Check if it's an internal link
        if (href && href.startsWith("/")) {
          // Extract path without hash
          const [linkPath] = href.split("#");
          
          // Only show loader for actual page changes, not hash navigation
          if (linkPath && linkPath !== currentPath && linkPath !== pathname) {
            handleStart();
          }
        }
      }
    };

    document.addEventListener("click", handleClick, true); // Use capture phase

    return () => {
      window.removeEventListener('routeChangeStart', handleStart);
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "#B5D782",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: 100, md: 150 },
          height: { xs: 100, md: 150 },
          animation: `spin 2s linear infinite`,
          willChange: "transform",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      >
        <Image
          src="/images/neko/slider_thumb.png"
          alt="Loading"
          fill
          priority
          sizes="150px"
          style={{ objectFit: "contain" }}
        />
      </Box>
      <Typography
        variant="body1"
        align="center"
        mt={4}
        sx={{
          fontSize: { xs: 20, md: 30 },
          color: "#FDF8CE",
          fontWeight: 600,
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
}
