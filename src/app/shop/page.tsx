import MarqueeSlider from "@/components/MarqueeSlider";
import ProductCard from "@/components/ProductCard";
import { fetchMultipleCollections } from "@/lib/fetchCollection";
import { Box, Stack, Typography, Grid } from "@mui/material";
import ShopClientWrapper from "./ShopClientWrapper";
import Image from "next/image";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata = {
  title: "Shop Matcha | Premium Ceremonial Matcha & Accessories",
  description:
    "Shop premium ceremonial matcha from Wazuka, Japan. Browse our collection of organic matcha powder, traditional whisks, chawan bowls, and authentic Japanese tea accessories. Free shipping on orders over $50.",
  keywords: [
    "buy matcha online",
    "ceremonial matcha shop",
    "organic matcha powder",
    "matcha whisk",
    "matcha bowl",
    "Japanese tea accessories",
    "premium matcha",
    "matcha tea set",
  ],
  alternates: {
    canonical: getCanonicalUrl("shop"),
  },
  openGraph: {
    title: "Shop Matcha | Premium Ceremonial Matcha & Accessories",
    description:
      "Shop premium ceremonial matcha from Wazuka, Japan. Browse our collection of organic matcha powder and authentic Japanese tea accessories.",
    url: getCanonicalUrl("shop"),
    siteName: "Umi Matcha",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og/shop.png",
        width: 1200,
        height: 630,
        alt: "Umi Matcha Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Matcha | Premium Ceremonial Matcha & Accessories",
    description:
      "Shop premium ceremonial matcha from Wazuka, Japan and authentic Japanese tea accessories.",
    images: ["/images/og/shop.png"],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const categoriesData = [
  { handle: "matcha", title: "Matcha", limit: 12 },
  { handle: "matchaware", title: "Matchaware", limit: 12 },
  { handle: "bundles", title: "Bundles", limit: 8 },
];

export default async function ShopPage() {
  const collections = await fetchMultipleCollections(
    categoriesData.map(({ handle, limit }) => ({ handle, limit }))
  );

  return (
    <ShopClientWrapper>
      <Stack
        sx={{
          bgcolor: "primary.main",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          pt: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Wave */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: -280, sm: -300, md: -450 },
            left: 0,
            right: 0,
            width: { xs: 600, sm: 1500, md: "100%" },
            height: { xs: 490, sm: 580, md: 770 },
            transform: "rotate(180deg)",
            zIndex: 0,
          }}
        >
          <Image
            src="/images/backgrounds/green_wave.png"
            alt="Green wave background"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 1250px, (max-width: 900px) 1500px, 2000px"
            loading="lazy"
          />
        </Box>

        {/* Marquee */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 140, sm: 170, md: 180 },
            width: "100%",
            zIndex: 1,
          }}
        >
          <MarqueeSlider
            text="shop •"
            speed={50}
            direction="left"
            fontSize={{ xs: 20, md: 30 }}
          />
        </Box>

        {/* Collections Content */}
        <Box
          sx={{
            width: "100%",
            mt: { xs: 25, sm: 30, md: 35 },
          }}
        >
          {categoriesData.map(({ handle, title }) => {
            const collectionData = collections[handle];
            const products = collectionData?.products || [];

            if (products.length === 0) return null;

            return (
              <Grid
                container
                key={handle}
                id={handle}
                spacing={4}
                mb={10}
                justifyContent="center"
                alignItems="center"
                width="100%"
                sx={{
                  scrollMarginTop: { xs: "120px", md: "150px" }, // Offset for fixed navbar
                }}
              >
                <Box justifyContent="center" mx="auto" width={750}>
                  {/* Collection Title */}
                  <Typography
                    variant="h1"
                    sx={{
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: { xs: "9vw", sm: "6vw", md: "3vw" },
                      color: "background.default",
                      textTransform: "capitalize",
                      letterSpacing: 2,
                      mb: { xs: 2, md: 5 },
                    }}
                  >
                    {collectionData?.collectionInfo?.title || title}
                  </Typography>

                  {/* Products Grid */}
                  <Grid
                    container
                    spacing={2}
                    columnSpacing={0}
                    mb={{ xs: -3, md: 0 }}
                  >
                    {products.map(({ node: product }) => (
                      <Grid size={6} key={product.id}>
                        <ProductCard
                          product={product}
                          size={{ xs: 180, sm: 300, md: 350 }}
                          showControls
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            );
          })}
        </Box>

        <Stack
          position="relative"
          width="100%"
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
          pt={10}
          pb={{ xs: 0, md: 5 }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: -300, sm: -350, md: -520 },
              left: 0,
              right: 0,
              width: "100%",
              height: { xs: 500, sm: 600, md: 800 },
              zIndex: 0,
            }}
          >
            <Image
              src="/images/backgrounds/green_wave.png"
              alt="Green wave background"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 1250px, (max-width: 900px) 1500px, 2000px"
              loading="lazy"
            />
          </Box>

          <Box
            sx={{
              position: "relative",
              width: { xs: 150, sm: 135, md: 180 },
              height: { xs: 100, sm: 135, md: 180 },
              zIndex: 20,
            }}
          >
            <Image
              src="/images/neko/hello.png"
              alt="Hello neko"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 120px, (max-width: 900px) 135px, 180px"
              loading="lazy"
            />
          </Box>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mt: { xs: 0, md: -4 },
              mb: { xs: 2, md: 0 },
              color: "background.default",
              fontSize: { xs: 16, sm: 20, md: 26 },
              fontWeight: 500,
              position: "relative",
              zIndex: 20,
              width: { xs: "50%", sm: "30%", md: "100%" },
            }}
          >
            Matcha your flow <br />
            Shipping Pan India
          </Typography>
        </Stack>
      </Stack>
    </ShopClientWrapper>
  );
}
