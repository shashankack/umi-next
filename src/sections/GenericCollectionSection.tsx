import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { fetchCollection } from "../lib/fetchCollection";
import ProductCard from "../components/ProductCard";

type GenericCollectionSectionProps = {
  collectionHandle: string;
  title?: string;
  limit?: number;
  fallbackSearch?: boolean;
};

/**
 * Generic Server Component for displaying any collection
 * Can be reused for different collections by passing the handle
 *
 * @example
 * // Show matcha collection
 * <GenericCollectionSection collectionHandle="matcha" title="Matcha Products" />
 *
 * // Show accessories collection
 * <GenericCollectionSection collectionHandle="accessories" title="Accessories" limit={12} />
 */
const GenericCollectionSection = async ({
  collectionHandle,
  title,
  limit = 20,
  fallbackSearch = true,
}: GenericCollectionSectionProps) => {
  // Fetch collection data on the server
  const { products, collectionInfo } = await fetchCollection(
    collectionHandle,
    limit,
    fallbackSearch
  );

  // Use collection title if no custom title provided
  const displayTitle = title || collectionInfo?.title || collectionHandle;

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          No products found in &quot;{displayTitle}&quot;
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={5} py={{ xs: 5, md: 10 }} px={2}>
      {/* Collection Title */}
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          fontWeight: 500,
          fontSize: { xs: "8vw", md: "3vw" },
        }}
      >
        {displayTitle}
      </Typography>

      {/* Collection Description (if available) */}
      {collectionInfo?.description && (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto",
            color: "text.secondary",
          }}
        >
          {collectionInfo.description}
        </Typography>
      )}

      {/* Product Grid */}
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
        {products.map(({ node: product }) => (
          <ProductCard
            key={product.id}
            product={product}
            showControls={false}
          />
        ))}
      </Box>
    </Stack>
  );
};

export default GenericCollectionSection;
