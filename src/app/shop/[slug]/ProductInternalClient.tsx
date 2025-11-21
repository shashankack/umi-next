"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  useMediaQuery,
  Slider,
  Stack,
  Snackbar,
  Alert,
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { FaShoppingCart } from "react-icons/fa";
import { Product, ProductVariant } from "@/lib/shopify";
import { parseProductDescription } from "@/lib/htmlParsers";
import { useCart } from "@/context/CartContext";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/structuredData";
import { slugify } from "@/lib/slug";

interface ProductInternalClientProps {
  product: Product;
}

const ProductInternalClient: React.FC<ProductInternalClientProps> = ({
  product,
}) => {
  // console.log("ProductInternalClient received product:", product);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { addItem, isLoading } = useCart();

  const [selectedImage, setSelectedImage] = useState(
    product.images.edges[0]?.node.url || ""
  );
  const [imageLoading, setImageLoading] = useState(true);
  const [thumbnailsLoading, setThumbnailsLoading] = useState<Record<number, boolean>>(
    Object.fromEntries(product.images.edges.map((_, i) => [i, true]))
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => {
      const variants = product.variants.edges;
      return variants.length === 1 ? variants[0].node : null;
    }
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Parse product description
  const parsedData = useMemo(() => {
    return parseProductDescription(product.descriptionHtml);
  }, [product.descriptionHtml]);

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageLoading(true); // Reset loading state when changing image
  };

  const handleQuantityChange = (e: SelectChangeEvent<number>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      setErrorMessage("Please select a variant");
      setShowError(true);
      return;
    }

    try {
      await addItem(selectedVariant.id, quantity);
      setShowSuccess(true);
      // Reset quantity to 1 after successful add
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setErrorMessage("Failed to add item to cart. Please try again.");
      setShowError(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const handleVariantChange = (e: SelectChangeEvent<string>) => {
    const variantId = e.target.value;
    const newVariant = product.variants.edges.find(
      (edge) => edge.node.id === variantId
    )?.node;

    if (newVariant) {
      setSelectedVariant(newVariant);

      if (newVariant.image?.url) {
        setSelectedImage(newVariant.image.url);
      }
    }
  };

  // Get variant weight display
  const getWeightDisplay = (variant: ProductVariant | null) => {
    if (!variant || !variant.selectedOptions) return null;

    const weightOption = variant.selectedOptions.find(
      (opt) =>
        opt.name.toLowerCase() === "weight" || opt.name.toLowerCase() === "size"
    );

    return weightOption?.value;
  };

  const weightDisplay = getWeightDisplay(selectedVariant);

  // Check if product is available
  const isAvailable = selectedVariant?.availableForSale ?? false;
  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : 0;
  const isComingSoon = currentPrice === 0;
  const quantityAvailable = selectedVariant?.quantityAvailable ?? 0;
  const isOutOfStock = !isAvailable || quantityAvailable === 0;

  // console.log("Rendering ProductInternalClient, product title:", product.title);

  // Generate structured data
  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://umimatchashop.com" },
    { name: "Shop", url: "https://umimatchashop.com/shop" },
    {
      name: product.title,
      url: `https://umimatchashop.com/shop/${slugify(product.title)}`,
    },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Stack
        bgcolor={theme.palette.secondary.main}
        width="100%"
        minHeight="100vh"
        pt={isMobile ? 10 : 10}
      >
        {/* Top Section - Product Details */}
        <Stack
          width="100%"
          minHeight={isMobile ? "100%" : "60vh"}
          direction="row"
          bgcolor={theme.palette.secondary.main}
          borderRadius={6}
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          mt={isMobile ? 8 : 10}
          mb={
            isMobile
              ? parsedData.productProfile.left.length > 0
                ? 0
                : 6
              : parsedData.productProfile.left.length > 0
              ? 0
              : 10
          }
          px={isMobile ? 2 : 10}
        >
          {/* Image and Text Section */}
          <Stack
            direction={isMobile ? "column" : "row"}
            width="100%"
            gap={isMobile ? 2 : 5}
            px={isMobile ? 1 : 0}
          >
            {/* Image Section */}
            <Stack
              width={isMobile ? "100%" : "30vw"}
              justifyContent="center"
              alignItems="center"
              py={{ xs: 2, md: 0 }}
            >
              <Box
                p={2}
                boxShadow={
                  isMobile
                    ? "none"
                    : `3px 3px 0px 0px ${theme.palette.text.secondary}`
                }
                borderRadius={4}
                bgcolor={theme.palette.background.default}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  mb={isMobile ? 2 : 0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={{ xs: 280, sm: 300, md: 350, lg: 420, xl: 550 }}
                  width="100%"
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: 2,
                    }}
                  >
                    {imageLoading && (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        animation="wave"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          borderRadius: 2,
                          bgcolor: "rgba(181, 215, 130, 0.1)",
                        }}
                      />
                    )}
                    <Image
                      src={selectedImage}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ 
                        objectFit: "contain", 
                        borderRadius: "8px",
                        opacity: imageLoading ? 0 : 1,
                        transition: "opacity 0.3s ease-in-out"
                      }}
                      priority
                      onLoad={() => setImageLoading(false)}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    gap: 0.5,
                    overflowX: "auto",
                    overflowY: "hidden",
                    pb: 1,
                    "&::-webkit-scrollbar": {
                      height: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: theme.palette.text.secondary,
                      borderRadius: "3px",
                    },
                  }}
                >
                  {product.images.edges.map((image, i) => (
                    <Box
                      key={i}
                      onClick={() => handleThumbnailClick(image.node.url)}
                      sx={{
                        position: "relative",
                        minWidth: "80px",
                        width: "80px",
                        height: "80px",
                        borderRadius: 1,
                        cursor: "pointer",
                        border:
                          image.node.url === selectedImage
                            ? `2px solid ${theme.palette.text.secondary}`
                            : "2px solid transparent",
                        transition: "border 0.2s ease",
                        flexShrink: 0,
                        "&:hover": {
                          border: `2px solid ${theme.palette.text.secondary}`,
                        },
                      }}
                    >
                      {thumbnailsLoading[i] && (
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height="100%"
                          animation="wave"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            borderRadius: 1,
                            bgcolor: "rgba(181, 215, 130, 0.1)",
                          }}
                        />
                      )}
                      <Image
                        src={image.node.url}
                        alt={`${product.title} - ${i + 1}`}
                        fill
                        style={{ 
                          objectFit: "contain", 
                          borderRadius: "4px",
                          opacity: thumbnailsLoading[i] ? 0 : 1,
                          transition: "opacity 0.3s ease-in-out"
                        }}
                        sizes="80px"
                        loading="lazy"
                        onLoad={() => setThumbnailsLoading(prev => ({ ...prev, [i]: false }))}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Stack>

            {/* Text Section */}
            <Stack
              width="100%"
              height="100%"
              color={theme.palette.background.default}
              alignItems="start"
              justifyContent="start"
              pt={3}
              px={{ xs: 1, sm: 0 }}
              gap={
                isMobile
                  ? parsedData.fullDescription
                    ? 4
                    : 2
                  : parsedData.fullDescription
                  ? 1
                  : 2
              }
            >
              <Typography
                variant="h6"
                mt={isMobile ? -4 : -4}
                mb={isMobile ? -2 : 0}
                fontSize={{ xs: "7vw", sm: "2.6vw" }}
                fontWeight={500}
                textAlign="start"
                width="100%"
                color={theme.palette.background.default}
                sx={{
                  letterSpacing: 1.3,
                  textShadow: `1px 5px 0px ${theme.palette.text.secondary}`,
                }}
              >
                {product.title}
              </Typography>

              {parsedData.tagline && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Bricolage",
                      fontWeight: 700,
                      textAlign: "justify",
                      fontSize: isMobile ? "3.4vw" : "1.2vw",
                      lineHeight: isMobile ? 1.3 : 0.8,
                    }}
                    dangerouslySetInnerHTML={{ __html: parsedData.tagline }}
                  />
                </Box>
              )}

              <Stack
                mt={isMobile ? 0 : 0}
                gap={
                  isMobile
                    ? parsedData.fullDescription
                      ? 0
                      : 2
                    : parsedData.fullDescription
                    ? 2
                    : 3
                }
                mb={isMobile ? 2 : 0}
                width="100%"
              >
                <Stack>
                  {selectedVariant && (
                    <Typography
                      variant="body1"
                      fontWeight={800}
                      mt={
                        isMobile
                          ? parsedData.fullDescription
                            ? -2
                            : 2
                          : parsedData.fullDescription
                          ? 1
                          : 0
                      }
                      mb={isMobile ? 2 : 0}
                      sx={{ fontSize: isMobile ? "4vw" : "1.6vw" }}
                    >
                      {isComingSoon ? (
                        <Box
                          component="span"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 700,
                            fontSize: isMobile ? "5vw" : "1.8vw",
                          }}
                        >
                          COMING SOON
                        </Box>
                      ) : (
                        // `₹ ${Math.floor(currentPrice)}/-`
                        `₹COMING SOON`
                      )}
                    </Typography>
                  )}

                  {product.variants.edges.length > 1 && (
                    <Select
                      value={selectedVariant?.id || ""}
                      onChange={handleVariantChange}
                      displayEmpty
                      size="small"
                      sx={{
                        mt: 2,
                        width: isMobile ? "100%" : "30%",
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        borderRadius: 2,
                        boxShadow: `0px 4px 0px 0px ${theme.palette.text.secondary}`,
                        fontFamily: "Bricolage",
                        fontWeight: 500,
                        fontSize: isMobile ? "1rem" : "0.9vw",
                        minWidth: 160,
                        "& .MuiSelect-icon": {
                          color: theme.palette.text.secondary,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.secondary,
                            boxShadow: `2px 4px 8px rgba(0, 0, 0, 0.15)`,
                            borderRadius: 2,
                            "& .MuiMenuItem-root": {
                              fontFamily: "Bricolage",
                              fontSize: isMobile ? "3.5vw" : "0.9vw",
                              "&:hover": {
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.default,
                              },
                              "&.Mui-selected": {
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.default,
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choose your matcha
                      </MenuItem>
                      {product.variants.edges.map(({ node }) => (
                        <MenuItem key={node.id} value={node.id}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            width="100%"
                            alignItems="center"
                          >
                            <span>{node.title}</span>
                            <span>
                              ₹{Math.floor(parseFloat(node.price.amount))}
                            </span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Stack>

                <Stack
                  width="100%"
                  direction="row"
                  alignItems="center"
                  justifyContent="start"
                  gap={2}
                >
                  {!isComingSoon && !isOutOfStock && (
                    <Select
                      value={quantity}
                      onChange={handleQuantityChange}
                      size="small"
                      displayEmpty
                      sx={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        borderRadius: 2,
                        boxShadow: `0px 4px 0px 0px ${theme.palette.text.secondary}`,
                        fontFamily: "Bricolage",
                        fontWeight: 500,
                        fontSize: isMobile ? "0.7rem" : "0.9vw",
                        minWidth: 80,
                        "& .MuiSelect-icon": {
                          color: theme.palette.text.secondary,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:hover": {
                          backgroundColor: theme.palette.text.secondary,
                          color: theme.palette.background.default,
                          "& .MuiSelect-icon": {
                            color: theme.palette.background.default,
                          },
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.secondary,
                            boxShadow: `2px 4px 8px rgba(0, 0, 0, 0.15)`,
                            borderRadius: 2,
                            "& .MuiMenuItem-root": {
                              fontFamily: "Bricolage",
                              fontSize: isMobile ? "3.5vw" : "0.9vw",
                              "&:hover": {
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.default,
                              },
                              "&.Mui-selected": {
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.default,
                              },
                            },
                          },
                        },
                      }}
                    >
                      {[...Array(10).keys()].map((i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  )}

                  <Button
                    onClick={handleAddToCart}
                    variant="contained"
                    disabled={
                      !selectedVariant ||
                      isLoading ||
                      isComingSoon ||
                      isOutOfStock
                    }
                    fullWidth={isMobile}
                    sx={{
                      fontFamily: "Bricolage",
                      fontWeight: 400,
                      textAlign: "justify",
                      fontSize: isMobile ? "0.7rem" : "1rem",
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.secondary,
                      boxShadow: `4px  4px 0px ${theme.palette.text.secondary}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: theme.palette.text.secondary,
                        color: theme.palette.background.default,
                        boxShadow: `4px 4px 0px ${theme.palette.background.default}`,
                      },
                      "&:disabled": {
                        backgroundColor: "grey.400",
                        color: "grey.600",
                        boxShadow: `4px 4px 0px grey.500`,
                      },
                    }}
                    endIcon={
                      !isComingSoon && !isOutOfStock ? <FaShoppingCart /> : null
                    }
                  >
                    {isLoading
                      ? "Adding..."
                      : isComingSoon
                      ? "Coming Soon"
                      : isOutOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </Button>
                </Stack>

                {/* Out of Stock or Coming Soon Message */}

                <Stack
                  mt={isMobile ? 1 : 0}
                  direction="row"
                  gap={2}
                  width="100%"
                  flexWrap="wrap"
                >
                  {parsedData.highlightedAttributes.map((attr, index) => (
                    <Typography
                      key={index}
                      variant="h5"
                      sx={{
                        p: isMobile ? "6px 10px" : "10px 30px",
                        mb: { xs: 1, md: 0 },
                        fontWeight: 200,
                        borderRadius: isMobile ? 1 : 3,
                        textAlign: "justify",
                        color: theme.palette.text.secondary,
                        fontFamily: "Bricolage",
                        backgroundColor: theme.palette.background.default,
                        fontSize: isMobile ? "3vw" : ".9vw",
                        boxShadow: `0px 4px 0px 0px ${theme.palette.text.secondary}`,
                      }}
                    >
                      {attr}
                    </Typography>
                  ))}
                  {weightDisplay && (
                    <Typography
                      variant="h5"
                      sx={{
                        p: isMobile ? "6px 10px" : "10px 30px",
                        fontWeight: 500,
                        borderRadius: isMobile ? 1 : 3,
                        textAlign: "justify",
                        color: theme.palette.text.secondary,
                        fontFamily: "Bricolage",
                        backgroundColor: theme.palette.background.default,
                        fontSize: isMobile ? "3vw" : ".9vw",
                        boxShadow: `0px 4px 0px 0px ${theme.palette.text.secondary}`,
                      }}
                    >
                      weight: {weightDisplay}
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Stack
                fontFamily="Bricolage"
                fontWeight={200}
                textAlign="justify"
              >
                {parsedData.paragraphs.map((paragraph, index) => (
                  <Typography
                    key={index}
                    gutterBottom
                    sx={{
                      fontFamily: "Bricolage",
                      fontWeight: 500,
                      textAlign: "justify",
                      fontSize: isMobile ? "2.8vw" : "1.2vw",
                      mt: isMobile ? -2 : 2,
                      mb: 2,
                      "& strong": {
                        fontWeight: 900,
                        fontSize: isMobile ? "3vw" : "1.2vw",
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
                <Stack direction="row" gap={4} flexWrap="wrap">
                  {parsedData.attributes.map((attr, index) => (
                    <Typography
                      key={index}
                      gutterBottom
                      sx={{
                        fontFamily: "Bricolage",
                        fontWeight: 500,
                        textAlign: "justify",
                        fontSize: isMobile ? "2.8vw" : "1vw",
                      }}
                    >
                      {attr}
                    </Typography>
                  ))}
                </Stack>
                {parsedData.summary && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Bricolage",
                        fontWeight: 800,
                        textAlign: isMobile ? "justify" : "start",
                        fontSize: isMobile ? "3vw" : "1.2vw",
                        mt: 2,
                        mb: { xs: -4, md: 2 },
                      }}
                      dangerouslySetInnerHTML={{ __html: parsedData.summary }}
                    />
                  </Box>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Bottom Section - Product Profile & Tasting Notes */}
        {parsedData.productProfile.left.length > 0 &&
          parsedData.tastingNotes.left.length > 0 && (
            <Stack
              direction={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              mt={10}
              width="100%"
              minHeight="100%"
              bgcolor={theme.palette.background.default}
              overflow="hidden"
              px={isMobile ? 2 : 6}
              py={isMobile ? 4 : 6}
              gap={isMobile ? 4 : 0}
            >
              {/* Product Profile */}
              <Stack alignItems="center" justifyContent="center">
                <Typography
                  gutterBottom
                  color={theme.palette.text.secondary}
                  variant="h4"
                  fontFamily="Gliker"
                  textTransform="capitalize"
                  fontSize={isMobile ? "5vw" : "2vw"}
                >
                  product profile
                </Typography>

                <Box
                  width={isMobile ? "100%" : "50vw"}
                  height={isMobile ? "auto" : 550}
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  border={`4px solid ${theme.palette.text.secondary}`}
                  borderRadius={isMobile ? 2 : 8}
                  fontFamily="Bricolage"
                  overflow="hidden"
                >
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      overflow: "hidden",
                      borderRadius: isMobile
                        ? "4px 0 4px 4px"
                        : "28px 0 28px 28px",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        height: "100%",
                        borderSpacing: "0",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        {parsedData.productProfile.left.map((label, i) => (
                          <tr key={i}>
                            <td
                              style={{
                                padding: "14px 40px",
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.background.default,
                                fontWeight: 500,
                                fontSize: isMobile ? "0.8rem" : "1rem",
                                textAlign: "left",
                              }}
                            >
                              {label}
                            </td>
                            <td
                              style={{
                                padding: "14px 10px",
                                backgroundColor:
                                  theme.palette.background.default,
                                color: theme.palette.text.secondary,
                                fontWeight: 500,
                                fontSize: isMobile ? "0.8rem" : "1rem",
                                textAlign: "left",
                              }}
                            >
                              {parsedData.productProfile.right[i]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Box>
              </Stack>

              {/* Tasting Notes */}
              <Stack alignItems="center" justifyContent="center" width="100%">
                <Typography
                  gutterBottom
                  color={theme.palette.text.secondary}
                  variant="h4"
                  fontFamily="Gliker"
                  textTransform="capitalize"
                  fontSize={isMobile ? "5vw" : "2vw"}
                >
                  tasting notes
                </Typography>
                <Box
                  borderRadius={isMobile ? 4 : 8}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  width={isMobile ? "100%" : "40vw"}
                  height={550}
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                  }}
                >
                  <Box width="100%">
                    {parsedData.tastingNotes.left.map((label, index) => {
                      const value = parsedData.tastingNotes.right[index];

                      return (
                        <Box
                          key={index}
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          marginBottom={1}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              position: "relative",
                              textAlign: "start",
                              fontWeight: "bold",
                              mb: 1,
                              width: "90%",
                              color: theme.palette.background.default,
                            }}
                          >
                            {label}
                          </Typography>
                          <Slider
                            value={parseInt(value) || 0}
                            disabled
                            sx={{
                              width: "90%",
                              borderRadius: 6,
                              "&.Mui-disabled": {
                                height: isMobile ? "100%" : "auto",
                                color: theme.palette.text.secondary,
                                backgroundColor:
                                  theme.palette.background.default,
                                "& .MuiSlider-thumb::after": {
                                  background: `url(/images/neko/slider_thumb.png) no-repeat center center`,
                                  backgroundSize: "cover",
                                  width: "50px",
                                  height: "50px",
                                  position: "absolute",
                                  top: "5px",
                                  left: "-5px",
                                  borderRadius: 0,
                                },
                                "& .MuiSlider-track": {
                                  backgroundColor: theme.palette.text.secondary,
                                  height: "80%",
                                  marginLeft: "3px",
                                  borderRadius: 8,
                                },
                                "& .MuiSlider-rail": {
                                  display: "none",
                                },
                              },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Stack>
            </Stack>
          )}

        {/* Full Description */}
        {parsedData.fullDescription && (
          <Box
            width="100%"
            bgcolor={theme.palette.secondary.main}
            px={{ xs: 2, md: 8 }}
            py={4}
          >
            <Typography
              color={theme.palette.background.default}
              fontSize={22}
              fontFamily="Bricolage"
              fontWeight={600}
            >
              Full description:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Bricolage",
                fontWeight: 500,
                textAlign: "justify",
                fontSize: isMobile ? "3vw" : "1vw",
                color: theme.palette.background.default,
              }}
            >
              {parsedData.fullDescription}
            </Typography>
          </Box>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{
              width: "100%",
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.background.default,
              fontFamily: "Bricolage",
              fontWeight: 500,
              "& .MuiAlert-icon": {
                color: theme.palette.background.default,
              },
            }}
          >
            Item added to cart successfully!
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{
              width: "100%",
              fontFamily: "Bricolage",
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};

export default ProductInternalClient;
