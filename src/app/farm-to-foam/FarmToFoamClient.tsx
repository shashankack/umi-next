"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Dynamically import Swiper to reduce initial bundle size
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SwiperComponent: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SwiperSlideComponent: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SwiperModules: any = null;

export default function FarmToFoamClient() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showMore, setShowMore] = useState(false);
  const [swiperLoaded, setSwiperLoaded] = useState(false);

  // Load Swiper dynamically
  useEffect(() => {
    const loadSwiper = async () => {
      const [{ Swiper, SwiperSlide }, { Autoplay, EffectCreative }] =
        await Promise.all([import("swiper/react"), import("swiper/modules")]);

      SwiperComponent = Swiper;
      SwiperSlideComponent = SwiperSlide;
      SwiperModules = { Autoplay, EffectCreative };
      setSwiperLoaded(true);
    };

    loadSwiper();
  }, []);

  // Use desktop images if not mobile, else use original images
  const galleryImages = isMobile
    ? [
        "/images/matcha-gallery/image_1.png",
        "/images/matcha-gallery/image_2.png",
        "/images/matcha-gallery/image_3.png",
        "/images/matcha-gallery/image_4.png",
        "/images/matcha-gallery/image_5.png",
        "/images/matcha-gallery/image_6.png",
        "/images/matcha-gallery/image_7.png",
        "/images/matcha-gallery/image_8.png",
      ]
    : [
        "/images/matcha-gallery/desktop/image1.webp",
        "/images/matcha-gallery/desktop/image2.webp",
        "/images/matcha-gallery/desktop/image3.webp",
        "/images/matcha-gallery/desktop/image4.webp",
        "/images/matcha-gallery/desktop/image5.webp",
        "/images/matcha-gallery/desktop/image6.webp",
        "/images/matcha-gallery/desktop/image7.webp",
      ];

  return (
    <Stack minHeight="100vh" bgcolor="background.default" pt={14}>
      <Box
        height={{ xs: "35vh", sm: "50vh", md: "60vh" }}
        position="relative"
        overflow="hidden"
      >
        <Typography
          variant="h1"
          sx={{
            width: "100%",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "background.default",
            zIndex: 2,
            textTransform: "uppercase",
            fontSize: { xs: 35, sm: 50, md: 80 },
            fontWeight: 600,
          }}
        >
          Farm to Foam
        </Typography>

        {swiperLoaded &&
          SwiperComponent &&
          SwiperSlideComponent &&
          SwiperModules && (
            <SwiperComponent
              style={{ height: "100%" }}
              loop
              autoplay={{
                delay: 1000,
              }}
              grabCursor={true}
              effect={"creative"}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: ["-20%", 0, -1],
                },
                next: {
                  translate: ["100%", 0, 0],
                },
              }}
              modules={[SwiperModules.EffectCreative, SwiperModules.Autoplay]}
            >
              {galleryImages.map((image, index) => (
                <SwiperSlideComponent key={index}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Matcha farm in Wazuka, Japan - Image ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="100vw"
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                    />
                  </Box>
                </SwiperSlideComponent>
              ))}
            </SwiperComponent>
          )}
      </Box>

      <Box
        sx={{
          m: { xs: 3, md: 6 },
          p: { xs: 3, md: 6 },
          borderRadius: { xs: 4, md: 8 },
          bgcolor: "primary.main",
        }}
      >
        <Typography
          fontSize={{ xs: 14, md: 22 }}
          textAlign="justify"
          sx={{ color: "background.default" }}
        >
          Umi partners up exclusively with certified organic farms in Japan,
          where matcha is cultivated with care, free from pesticides and harmful
          additives. Our organic matcha comes from a 300+ year old farm in
          Wazuka, a tiny region where the fog off the river keeps the leaves
          shaded and the soil just moist enough. The result? smooth, milky,
          buttery matcha with no bitterness. single cultivar, all organic.
          <br />
          <br />
        </Typography>
        {isMobile ? (
          <>
            {!showMore && (
              <Button
                variant="text"
                sx={{
                  ml: -1,
                  color: "background.default",
                  fontWeight: 400,
                  boxShadow: "none",
                  textTransform: "none",
                  mt: -2,
                }}
                onClick={() => setShowMore(true)}
              >
                Read More...
              </Button>
            )}
            <Collapse in={showMore} timeout={400}>
              <Typography
                fontSize={14}
                textAlign="justify"
                sx={{
                  color: "background.default",
                  transformOrigin: "top center",
                }}
              >
                Our farm is rooted in integrity, where matcha is grown without
                herbicides, pesticides, or synthetic fertilizers. Every leaf is
                nurtured in harmony with nature, picked by hand, tana shaded
                with care, and stone-milled to preserve its rich umami and vivid
                hue.
                <br />
                <br />
                In these quiet hills of Wazuka, Japan where morning mists cling
                gently to the tea fields - we stood among rows of vibrant green
                leaves at the farm. This wasn&apos;t just a visit; it was a
                pilgrimage to the source of purity. From the soils of Wazuka to
                the matcha bowls of India, this journey is a tribute to the
                beauty of intention. It&apos;s about honouring tradition while
                embracing a global vision - where every sip carries the story of
                a farm, a philosophy, and a promise of a brand.
                <br />
                <br />
                This is farm to foam and it&apos;s only the beginning.
              </Typography>
            </Collapse>
          </>
        ) : (
          <Typography
            fontSize={{ xs: 14, md: 22 }}
            textAlign="justify"
            sx={{ color: "background.default" }}
          >
            Our farm is rooted in integrity, where matcha is grown without
            herbicides, pesticides, or synthetic fertilizers. Every leaf is
            nurtured in harmony with nature, picked by hand, tana shaded with
            care, and stone-milled to preserve its rich umami and vivid hue.
            <br />
            <br />
            In these quiet hills of Wazuka, Japan where morning mists cling
            gently to the tea fields - we stood among rows of vibrant green
            leaves at the farm. This wasn&apos;t just a visit; it was a
            pilgrimage to the source of purity. From the soils of Wazuka to the
            matcha bowls of India, this journey is a tribute to the beauty of
            intention. It&apos;s about honouring tradition while embracing a
            global vision - where every sip carries the story of a farm, a
            philosophy, and a promise of a brand.
            <br />
            <br />
            This is farm to foam and it&apos;s only the beginning.
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
