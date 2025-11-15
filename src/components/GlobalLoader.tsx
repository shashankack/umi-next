"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reset loading state when navigation completes
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Handle navigation start
    const handleStart = () => setLoading(true);
    
    // Handle custom event from menu drawer
    const handleCustomStart = () => setLoading(true);

    // Listen for clicks on links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        // Check if it's an internal link
        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("/#") &&
          href !== pathname
        ) {
          handleStart();
        }
      }
    };

    // Add click listener
    document.addEventListener("click", handleClick);
    // Add custom event listener for menu drawer
    window.addEventListener('routeChangeStart', handleCustomStart);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener('routeChangeStart', handleCustomStart);
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
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
        transition: "opacity 0.3s ease-in-out",
        "& img": {
          willChange: "transform",
        },
      }}
    >
      <Box
        component="img"
        src="/images/neko/slider_thumb.png"
        alt="Loading"
        sx={{
          width: { xs: 100, md: 150 },
          height: { xs: 100, md: 150 },
          objectFit: "contain",
          animation: `spin 2s linear infinite`,
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
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
