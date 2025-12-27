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
import { CheckeredGrid } from "@/components/CheckeredGrid";
import { Collection } from "@/lib/shopify";
import WavyMarquee from "@/components/WavyMarquee";
import Image from "next/image";

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
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const waveUseRef = useRef<SVGUseElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Filter out "UMI DUO BUNDLE" from both product lists
  const filteredMatchaProducts = matchaProducts.filter(
    ({ node: product }) => product.title !== "Umi Duo Bundle"
  );
  const filteredMatchaWareProducts = matchaWareProducts.filter(
    ({ node: product }) => product.title !== "Umi Duo Bundle"
  );

  // Scroll-linked animation for the wave y value
  useEffect(() => {
    // Skip animation on mobile or if reduced motion is preferred
    if (isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ScrollTrigger: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsap: any = null;

    const start = "top center";

    const setup = async () => {
      // Lazy load GSAP only when needed
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
    <Stack overflow="hidden">
      <Box
        overflow="hidden"
        position="relative"
        bgcolor="primary.main"
        px={2}
        py={4}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            textTransform: "capitalize",
            letterSpacing: 3,
            fontWeight: 600,
            fontSize: { xs: "5vw", md: "3.4vw" },
          }}
        >
          Kinder rituals that fill your cup
        </Typography>
      </Box>

      <Stack
        pt={{ xs: 4, md: 14 }}
        pb={{ xs: 10, sm: 10, md: 20 }}
        px={2}
        spacing={5}
        position="relative"
        zIndex={20}
      >
        <CheckeredGrid top={0} left={0} right={0} />
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 500,
            fontSize: { xs: "10vw", md: "4vw" },
          }}
        >
          Best Sellers
        </Typography>

        {filteredMatchaProducts.length === 0 ? (
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
              {filteredMatchaProducts.map(({ node: product }) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showControls={false}
                />
              ))}
            </Box>
            {filteredMatchaWareProducts.length > 0 && (
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
                {filteredMatchaWareProducts.map(({ node: product }) => (
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
        height={{ xs: 440, sm: 300, md: 650 }}
        bgcolor="background.default"
        position="relative"
        alignItems="center"
      >
        <Box
          position="absolute"
          top={{ xs: "-20%", sm: "-42%", md: "-15%", lg: "-17%" }}
          left={{ xs: "-17%", sm: "-30%", md: 0 }}
          width={{ xs: "250%", sm: "195%", md: "100%" }}
          zIndex={10}
        >
          <WavyMarquee
            speed={10}
            direction="left"
            fontSize={isMobile ? "16px" : isTablet ? "22px" : "28px"}
            height={{ xs: 200, sm: 240, md: 200, lg: 200 }}
          />
        </Box>

        <Box
          component={motion.img}
          src="/images/neko/surfing.png"
          alt="Neko surfing"
          loading="lazy"
          decoding="async"
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
          bottom={{ xs: 0, md: -50 }}
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
          sx={{
            position: "relative",
            width: { xs: 270, md: 900 },
            height: { xs: 80, md: 180 },
            mt: 4,
          }}
        >
          <Image
            src={
              isMobile
                ? "/images/vectors/mobile_text.svg"
                : "/images/vectors/text.svg"
            }
            alt="Best Sellers"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 270px, 900px"
            loading="lazy"
          />
        </Box>

        <Button
          href="/shop"
          variant="contained"
          sx={{
            fontFamily: "Bricolage",
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
