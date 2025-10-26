"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import ProductCard from "../components/ProductCard";
import CurvedMarquee from "@/components/CurvedMarquee";
import { CheckeredGrid } from "@/components/CheckeredGrid";
import { Collection } from "@/lib/shopify";

type ProductImage = {
  url: string;
  altText?: string;
};

type Product = {
  id: string;
  title: string;
  featuredImage?: ProductImage;
  images?: {
    edges: { node: ProductImage }[];
  };
};

type BestSellersClientProps = {
  matchaProducts: { node: Product }[];
  matchaWareProducts: { node: Product }[];
  collectionInfo: Collection | null;
};

/**
 * Client Component - Handles animations and interactivity
 * Receives data from server component as props
 */
const BestSellersClient = ({
  matchaProducts,
  matchaWareProducts,
}: BestSellersClientProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const waveUseRef = useRef<SVGUseElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll-linked animation for the wave y value
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ScrollTrigger: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsap: any = null;

    const start = isMobile ? "top 30%" : "top center";

    const setup = async () => {
      const gsapMod = await import("gsap");
      gsap = gsapMod.default || gsapMod;
      const st = await import("gsap/ScrollTrigger");
      ScrollTrigger = st.default || st;
      gsap.registerPlugin(ScrollTrigger);

      if (!waveUseRef.current || !sectionRef.current) return;

      const proxy = { y: 428 };

      ctx = gsap.context(() => {
        gsap.to(proxy, {
          y: -128,
          ease: "back.out(1.1)",
          duration: 1.5,
          scrollTrigger: {
            // markers: true,
            trigger: sectionRef.current,
            start: start,
            end: "bottom top",
          },
          onUpdate: () => {
            try {
              waveUseRef.current?.setAttribute("y", String(proxy.y));
            } catch {
              // ignore
            }
          },
        });
      }, sectionRef.current);
    };

    setup().catch(() => console.error("GSAP setup failed"));

    return () => {
      try {
        if (ctx) ctx.revert();
        if (ScrollTrigger)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ScrollTrigger.getAll?.().forEach((t: any) => t.kill());
      } catch {
        // ignore
      }
    };
  }, [isMobile]);

  return (
    <Stack>
      <Box
        overflow="hidden"
        position="relative"
        bgcolor="primary.main"
        pt={{ xs: 3, md: 8 }}
        pb={{ xs: 10, md: 20 }}
        px={2}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            textShadow: " 0.323px 2.258px 0 #B5D782",
            textTransform: "capitalize",
            letterSpacing: 3,
            fontWeight: 600,
            fontSize: { xs: "4vw", md: "4vw" },
          }}
        >
          Kinder rituals that fill your cup
        </Typography>
        <CheckeredGrid bottom={0} left={0} right={0} />
      </Box>

      <Stack
        pt={{ xs: 5, md: 10 }}
        pb={{ xs: 10, sm: 10, md: 20 }}
        px={2}
        spacing={5}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 500,
            fontSize: { xs: "10vw", md: "3vw" },
          }}
        >
          Best Sellers
        </Typography>

        {matchaProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "center" },
                gap: { xs: 1, md: 2 },
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {matchaProducts.map(({ node: product }) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showControls={false}
                />
              ))}
            </Box>
            {matchaWareProducts.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "center" },
                  gap: { xs: 1, md: 2 },
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {matchaWareProducts.map(({ node: product }) => (
                  <Box
                    key={product.id}
                    sx={{
                      minWidth: { xs: 150, sm: 200, md: 204 },
                      flex: "0 0 auto",
                      pointerEvents: "auto",
                    }}
                  >
                    <ProductCard
                      size={{ xs: 150, sm: 200, md: 204 }}
                      product={product}
                      showControls={false}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Stack>
      <Stack
        height={{ xs: 480, sm: 300, md: 700 }}
        bgcolor="background.default"
        position="relative"
        alignItems="center"
      >
        <Box
          position="absolute"
          width="100%"
          top={{ xs: -210, sm: -90, md: -100, lg: "-13%", xl: "-20%" }}
          left={0}
          zIndex={100}
        >
          <CurvedMarquee />
        </Box>

        <Box
          component={motion.img}
          src="/images/neko/surfing.png"
          sx={{
            position: "relative",
            zIndex: 20,
            mt: { xs: 7, md: 15 },
            width: { xs: 130, md: 200 },
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <Box
          ref={sectionRef}
          width="100%"
          height="100%"
          position="absolute"
          bottom={0}
          left={0}
          overflow="hidden"
        >
          <Box
            component="svg"
            width={{ xs: "250%", md: "100%" }}
            height="100%"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            overflow="auto"
            shapeRendering="auto"
            fill="#ffffff"
          >
            <defs>
              <path
                id="wavepath"
                d="M 0 2000 0 500 Q 150 448 300 500 t 300 0 300 0 300 0 300 0 300 0  v1000 z"
              />
              <path id="motionpath" d="M -600 0 0 0" />
            </defs>
            <g>
              <use
                ref={waveUseRef}
                xlinkHref="#wavepath"
                y="428"
                fill="#F3EDB8"
              >
                <animateMotion dur="5s" repeatCount="indefinite">
                  <mpath xlinkHref="#motionpath" />
                </animateMotion>
              </use>
            </g>
          </Box>
        </Box>

        <Box
          component="img"
          src={
            isMobile
              ? "/images/vectors/mobile_text.svg"
              : "/images/vectors/text.svg"
          }
          sx={{
            position: "relative",
            width: { xs: 270, md: 900 },
            mt: 6,
          }}
        />

        <Button
          href="/shop"
          variant="contained"
          sx={{
            fontFamily: "Stolzl",
            color: "background.default",
            bgcolor: "secondary.main",
            borderRadius: 2,
            px: 2,
            py: 0,
            my: { xs: 4, md: 6 },
            fontSize: { xs: "5vw", md: "1.5rem" },
          }}
        >
          Shop All
        </Button>
      </Stack>
    </Stack>
  );
};

export default BestSellersClient;
