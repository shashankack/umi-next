import MarqueeSlider from "@/components/MarqueeSlider";
import ProductCard from "@/components/ProductCard";
import { fetchMultipleCollections } from "@/lib/fetchCollection";
import { Box, Stack, Typography, Grid } from "@mui/material";
import ShopClientWrapper from "./ShopClientWrapper";

export const metadata = {
  title: "Shop",
  description: "Welcome to the shop page",
  keywords: ["shop", "products", "ecommerce"],
};

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
          component="img"
          src="/images/backgrounds/green_wave.png"
          sx={{
            width: { xs: 1250, sm: 1500, md: 2000 },
            transform: "rotate(180deg)",
            position: "absolute",
            top: { xs: -280, sm: -300, md: -450 },
            zIndex: 0,
          }}
        />

        {/* Marquee */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 120, sm: 170, md: 180 },
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
            component="img"
            src="/images/backgrounds/green_wave.png"
            sx={{
              width: { xs: 1250, sm: 1500, md: 2000 },
              position: "absolute",
              bottom: { xs: -300, sm: -350, md: -520 },
              zIndex: 0,
            }}
          />

          <Box
            component="img"
            src="/images/neko/hello.png"
            sx={{
              width: { xs: 90, sm: 135, md: 180 },
              position: "relative",
              zIndex: 20,
            }}
          />

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mt: { xs: 0, md: 2 },
              mb: { xs: 2, md: 0 },
              color: "background.default",
              fontSize: { xs: "4vw", sm: "3vw", md: "1.5vw" },
              fontWeight: 500,
              position: "relative",
              zIndex: 20,
              width: { xs: "50%", sm: "30%", md: "100%" },
            }}
          >
            Matcha your flow Shipping Pan India
          </Typography>
        </Stack>
      </Stack>
    </ShopClientWrapper>
  );
}
