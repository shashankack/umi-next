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
  Divider,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Product, ProductVariant } from "@/lib/shopify";
import { parseProductDescription } from "@/lib/htmlParsers";
import { useCart } from "@/context/CartContext";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/structuredData";
import { slugify } from "@/lib/slug";
import Link from "next/link";

interface ProductInternalClientProps {
  product: Product;
}

const ProductInternalClient: React.FC<ProductInternalClientProps> = ({
  product,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { addItem, isLoading } = useCart();

  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => {
      const variants = product.variants.edges;
      return variants.length === 1 ? variants[0].node : null;
    },
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Parse product description
  const parsedData = useMemo(() => {
    return parseProductDescription(product.descriptionHtml);
  }, [product.descriptionHtml]);

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
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setErrorMessage("Failed to add item to cart. Please try again.");
      setShowError(true);
    }
  };

  const handleCloseSuccess = () => setShowSuccess(false);
  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const handleVariantChange = (e: SelectChangeEvent<string>) => {
    const variantId = e.target.value;
    const newVariant = product.variants.edges.find(
      (edge) => edge.node.id === variantId,
    )?.node;
    if (newVariant) {
      setSelectedVariant(newVariant);
      // Jump Swiper to the matching image when variant changes
      if (newVariant.image?.url && swiperRef) {
        const idx = product.images.edges.findIndex(
          (e) => e.node.url === newVariant.image?.url,
        );
        if (idx !== -1) swiperRef.slideTo(idx);
      }
    }
  };

  // Get variant weight display
  const getWeightDisplay = (variant: ProductVariant | null) => {
    if (!variant || !variant.selectedOptions) return null;
    const weightOption = variant.selectedOptions.find(
      (opt) =>
        opt.name.toLowerCase() === "weight" ||
        opt.name.toLowerCase() === "size",
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

  // ─── Shared style tokens ───────────────────────────────────────────────────
  const selectSx = {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
    borderRadius: 2,
    boxShadow: `0px 4px 0px 0px ${theme.palette.text.secondary}`,
    fontFamily: "Bricolage",
    fontWeight: 500,
    "& .MuiSelect-icon": { color: theme.palette.text.secondary },
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  };

  const menuPropsSx = {
    PaperProps: {
      sx: {
        mt: 1,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        boxShadow: `2px 4px 8px rgba(0,0,0,0.15)`,
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
  };

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
        {/* ── TOP SECTION ─────────────────────────────────────────────────── */}
        <Stack
          width="100%"
          px={isMobile ? 2 : 8}
          pt={isMobile ? 6 : 8}
          pb={isMobile ? 4 : 6}
          mb={parsedData.productProfile.left.length > 0 ? 0 : 4}
        >
          {/* Breadcrumb */}
          <Stack
            direction="row"
            gap={1}
            mb={isMobile ? 3 : 4}
            alignItems="center"
          >
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: product.title, href: null },
            ].map(({ label, href }, i, arr) => (
              <React.Fragment key={label}>
                {href ? (
                  <Link href={href} style={{ textDecoration: "none" }}>
                    <Typography
                      sx={{
                        fontFamily: "Bricolage",
                        fontSize: isMobile ? "2.8vw" : "0.75vw",
                        fontWeight: 400,
                        color: `#fd918fff`,
                        textTransform: "capitalize",
                        letterSpacing: 0.5,
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: theme.palette.background.default,
                        },
                      }}
                    >
                      {label}
                    </Typography>
                  </Link>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: "Bricolage",
                      fontSize: isMobile ? "2.8vw" : "0.75vw",
                      fontWeight: 700,
                      color: theme.palette.background.default,
                      textTransform: "capitalize",
                      letterSpacing: 0.5,
                    }}
                  >
                    {label}
                  </Typography>
                )}
                {i < arr.length - 1 && (
                  <Typography
                    sx={{
                      color: `${theme.palette.background.default}66`,
                      fontSize: isMobile ? "2.5vw" : "0.75vw",
                    }}
                  >
                    /
                  </Typography>
                )}
              </React.Fragment>
            ))}
          </Stack>

          {/* Two-column layout */}
          <Stack
            direction={isMobile ? "column" : "row"}
            gap={isMobile ? 4 : 8}
            alignItems={isMobile ? "stretch" : "flex-start"}
          >
            {/* ── LEFT: Image Swiper ───────────────────────────────────── */}
            <Box
              width={isMobile ? "100%" : "48%"}
              flexShrink={0}
              sx={
                isMobile
                  ? {}
                  : { position: "sticky", top: 96, alignSelf: "flex-start" }
              }
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  bgcolor: theme.palette.background.default,
                  overflow: "hidden",
                  height: isMobile ? 340 : 540,
                  // Swiper pagination dots
                  "& .swiper-pagination": {
                    bottom: "12px",
                  },
                  "& .swiper-pagination-bullet": {
                    width: 8,
                    height: 8,
                    backgroundColor: theme.palette.text.secondary,
                    opacity: 0.35,
                    transition: "opacity 0.2s, transform 0.2s",
                  },
                  "& .swiper-pagination-bullet-active": {
                    opacity: 1,
                    transform: "scale(1.3)",
                  },
                }}
              >
                <Swiper
                  modules={[Navigation, Pagination]}
                  pagination={{ clickable: true }}
                  onSwiper={setSwiperRef}
                  onSlideChange={(s) => setActiveIndex(s.realIndex)}
                  style={{ width: "100%", height: "100%" }}
                  loop={product.images.edges.length > 1}
                >
                  {product.images.edges.map((image, i) => (
                    <SwiperSlide key={i}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 2,
                        }}
                      >
                        <Image
                          src={image.node.url}
                          alt={`${product.title} ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 48vw"
                          style={{ objectFit: "contain", padding: "16px" }}
                          priority={i === 0}
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom prev / next buttons */}
                {product.images.edges.length > 1 && (
                  <>
                    <IconButton
                      onClick={() => swiperRef?.slidePrev()}
                      size="small"
                      sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        bgcolor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        boxShadow: `2px 2px 0px ${theme.palette.text.secondary}`,
                        border: `1.5px solid ${theme.palette.text.secondary}`,
                        width: 36,
                        height: 36,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: theme.palette.text.secondary,
                          color: theme.palette.background.default,
                        },
                      }}
                    >
                      <FaChevronLeft size={14} />
                    </IconButton>
                    <IconButton
                      onClick={() => swiperRef?.slideNext()}
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        bgcolor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        boxShadow: `2px 2px 0px ${theme.palette.text.secondary}`,
                        border: `1.5px solid ${theme.palette.text.secondary}`,
                        width: 36,
                        height: 36,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: theme.palette.text.secondary,
                          color: theme.palette.background.default,
                        },
                      }}
                    >
                      <FaChevronRight size={14} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* ── RIGHT: Product Info ──────────────────────────────────── */}
            <Stack flex={1} gap={0} color={theme.palette.background.default}>
              {/* Title */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: isMobile ? "7vw" : "clamp(28px, 2.2vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: 1,
                  lineHeight: 1.15,
                  textShadow: `1px 4px 0px ${theme.palette.text.secondary}`,
                  mb: 1,
                }}
              >
                {product.title}
              </Typography>

              {/* Tagline */}
              {parsedData.tagline && (
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    fontWeight: 500,
                    fontSize: isMobile ? "3.2vw" : "1vw",
                    lineHeight: 1.1,
                    opacity: 0.85,
                    mb: 2,
                  }}
                  dangerouslySetInnerHTML={{ __html: parsedData.tagline }}
                />
              )}

              <Divider
                sx={{
                  borderColor: `${theme.palette.background.default}33`,
                  mb: 3,
                }}
              />

              {/* Price */}
              {selectedVariant && (
                <Box mb={2.5}>
                  {isComingSoon ? (
                    <Typography
                      sx={{
                        fontFamily: "Bricolage",
                        fontWeight: 800,
                        fontSize: isMobile ? "5vw" : "1.2vw",
                        color: theme.palette.text.secondary,
                        bgcolor: theme.palette.background.default,
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        letterSpacing: 2,
                      }}
                    >
                      COMING SOON
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: "Bricolage",
                        fontWeight: 800,
                        fontSize: isMobile ? "6vw" : "1.8vw",
                        letterSpacing: 0.5,
                      }}
                    >
                      {/* {`₹ ${Math.floor(currentPrice)}/-`} */}
                      COMING SOON
                    </Typography>
                  )}
                </Box>
              )}

              {/* Variant selector */}
              {product.variants.edges.length > 1 && (
                <Box mb={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Bricolage",
                      fontSize: isMobile ? "3vw" : "0.8vw",
                      fontWeight: 600,
                      opacity: 0.7,
                      mb: 1,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Select Variant
                  </Typography>
                  <Select
                    value={selectedVariant?.id || ""}
                    onChange={handleVariantChange}
                    displayEmpty
                    size="small"
                    sx={{
                      ...selectSx,
                      width: isMobile ? "100%" : "60%",
                      fontSize: isMobile ? "1rem" : "0.9vw",
                      minWidth: 160,
                    }}
                    MenuProps={menuPropsSx}
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
                </Box>
              )}

              {/* Quantity + Add to Cart */}
              <Stack
                direction="row"
                gap={2}
                alignItems="center"
                mb={3}
                flexWrap="wrap"
              >
                {!isComingSoon && !isOutOfStock && (
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Bricolage",
                        fontSize: isMobile ? "3vw" : "0.8vw",
                        fontWeight: 600,
                        opacity: 0.7,
                        mb: 1,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Qty
                    </Typography>
                    <Select
                      value={quantity}
                      onChange={handleQuantityChange}
                      size="small"
                      displayEmpty
                      sx={{
                        ...selectSx,
                        minWidth: 80,
                        fontSize: isMobile ? "0.8rem" : "0.9vw",
                        "&:hover": {
                          backgroundColor: theme.palette.text.secondary,
                          color: theme.palette.background.default,
                          "& .MuiSelect-icon": {
                            color: theme.palette.background.default,
                          },
                        },
                      }}
                      MenuProps={menuPropsSx}
                    >
                      {[...Array(10).keys()].map((i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}

                <Box flex={isMobile ? 1 : "unset"} alignSelf="flex-end">
                  <Button
                    onClick={handleAddToCart}
                    variant="contained"
                    fullWidth={isMobile}
                    disabled={
                      !selectedVariant ||
                      isLoading ||
                      isComingSoon ||
                      isOutOfStock
                    }
                    endIcon={
                      !isComingSoon && !isOutOfStock ? <FaShoppingCart /> : null
                    }
                    sx={{
                      fontFamily: "Bricolage",
                      fontWeight: 600,
                      fontSize: isMobile ? "0.85rem" : "1rem",
                      px: isMobile ? 3 : 4,
                      py: 1.25,
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.secondary,
                      boxShadow: `4px 4px 0px ${theme.palette.text.secondary}`,
                      borderRadius: 2,
                      transition: "all 0.25s ease",
                      "&:hover": {
                        backgroundColor: theme.palette.text.secondary,
                        color: theme.palette.background.default,
                        boxShadow: `4px 4px 0px ${theme.palette.background.default}`,
                      },
                      "&:disabled": {
                        backgroundColor: "grey.400",
                        color: "grey.600",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {isLoading
                      ? "Adding..."
                      : isComingSoon
                        ? "Coming Soon"
                        : isOutOfStock
                          ? "Out of Stock"
                          : "Add to Cart"}
                  </Button>
                </Box>
              </Stack>

              {/* Highlighted attribute chips + weight */}
              {(parsedData.highlightedAttributes.length > 0 ||
                weightDisplay) && (
                <>
                  <Divider
                    sx={{
                      borderColor: `${theme.palette.background.default}33`,
                      mb: 2.5,
                    }}
                  />
                  <Stack direction="row" gap={1.5} flexWrap="wrap" mb={3}>
                    {parsedData.highlightedAttributes.map((attr, index) => (
                      <Typography
                        key={index}
                        sx={{
                          px: isMobile ? "12px" : "20px",
                          py: isMobile ? "6px" : "8px",
                          fontFamily: "Bricolage",
                          fontWeight: 600,
                          fontSize: isMobile ? "2.8vw" : "0.8vw",
                          borderRadius: 2,
                          color: theme.palette.text.secondary,
                          bgcolor: theme.palette.background.default,
                          boxShadow: `0px 3px 0px 0px ${theme.palette.text.secondary}`,
                        }}
                      >
                        {attr}
                      </Typography>
                    ))}
                    {weightDisplay && (
                      <Typography
                        sx={{
                          px: isMobile ? "10px" : "20px",
                          py: isMobile ? "6px" : "8px",
                          fontFamily: "Bricolage",
                          fontWeight: 500,
                          fontSize: isMobile ? "2.8vw" : "0.8vw",
                          borderRadius: 2,
                          color: theme.palette.text.secondary,
                          bgcolor: theme.palette.background.default,
                          boxShadow: `0px 3px 0px 0px ${theme.palette.text.secondary}`,
                        }}
                      >
                        Weight: {weightDisplay}
                      </Typography>
                    )}
                  </Stack>
                </>
              )}

              {/* Description paragraphs */}
              <Stack gap={0}>
                {parsedData.paragraphs.map((paragraph, index) => (
                  <Typography
                    key={index}
                    gutterBottom
                    sx={{
                      fontFamily: "Bricolage",
                      fontWeight: 500,
                      textAlign: "justify",
                      fontSize: isMobile ? "3vw" : "1vw",
                      lineHeight: 1.7,
                      mb: 1.5,
                      "& strong": { fontWeight: 900 },
                      "& ul": {
                        paddingLeft: "1.4em",
                        margin: "2em 0",
                        listStyleType: "disc",
                      },
                      "& li": {
                        marginBottom: "0.3em",
                        fontSize: isMobile ? "3vw" : "1vw",
                        fontFamily: "Bricolage",
                        fontWeight: 500,
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
                <Stack direction="row" gap={4} flexWrap="wrap">
                  {parsedData.attributes.map((attr, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontFamily: "Bricolage",
                        fontWeight: 500,
                        fontSize: isMobile ? "2.8vw" : "0.9vw",
                      }}
                    >
                      {attr}
                    </Typography>
                  ))}
                </Stack>
                {parsedData.summary && (
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Bricolage",
                      fontWeight: 800,
                      fontSize: isMobile ? "3vw" : "1.1vw",
                      mt: 2,
                    }}
                    dangerouslySetInnerHTML={{ __html: parsedData.summary }}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* ── BOTTOM SECTION: Product Profile & Tasting Notes ─────────────── */}
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

        {/* ── Full Description ─────────────────────────────────────────────── */}
        {parsedData.fullDescription && (
          <Box
            width="100%"
            bgcolor={theme.palette.secondary.main}
            px={{ xs: 2, md: 8 }}
            py={4}
          >
            <Typography
              color={theme.palette.background.default}
              fontSize={{ xs: "3vw", md: "1.2vw" }}
              fontFamily="Bricolage"
              fontWeight={800}
            >
              Full description:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Bricolage",
                fontWeight: 500,
                textAlign: "justify",
                fontSize: { xs: "2.8vw", md: "1vw" },
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
