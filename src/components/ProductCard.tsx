"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

type ProductImage = {
  url: string;
  altText?: string;
};

type ProductVariant = {
  id: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  quantityAvailable?: number;
};

type Product = {
  id: string;
  title: string;
  handle: string;
  featuredImage?: ProductImage;
  images?: {
    edges: { node: ProductImage }[];
  };
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants?: {
    edges: Array<{ node: ProductVariant }>;
  };
  tags?: string[];
};

interface ProductCardProps {
  product: Product;
  size?:
    | number
    | { xs: number | string; sm: number | string; md: number | string }
    | string;
  showControls?: boolean;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = { xs: 200, sm: 250, md: 350 },
  showControls = false,
  onProductClick,
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [localQuantity, setLocalQuantity] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { addItem, cart, isLoading } = useCart();

  const slug = product.handle;
  const height =
    typeof size === "object"
      ? Object.fromEntries(
          Object.entries(size).map(([k, v]) => [k, (v as number) * 1.3]),
        )
      : (size as number) * 1.2;

  // Log the alt tag value for the product image
  const altTag = product.featuredImage?.altText || product.title;
  // console.log("ProductCard alt tag:", altTag);

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // Get product price and variant
  const price = product.priceRange?.minVariantPrice
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : 0;
  const firstVariant = product.variants?.edges?.[0]?.node;
  const variantId = firstVariant?.id;
  const isComingSoon = price === 0;

  const handleCloseSuccess = () => setShowSuccess(false);
  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const openCartDrawer = () => {
    window.dispatchEvent(new CustomEvent("openCartDrawer"));
  };

  const trackMetaAddToCart = () => {
    if (typeof window === "undefined") return;
    const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
    if (!fbq || !variantId) return;

    fbq("track", "AddToCart", {
      content_ids: [variantId],
      content_name: product.title,
      content_type: "product",
      value: Number(price.toFixed(2)),
      currency: "INR",
    });
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    console.log("[ProductCard] add-to-cart click", {
      productHandle: product.handle,
      variantId,
      isComingSoon,
      isLoading,
      isAddingToCart,
    });
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || isComingSoon) return;

    try {
      setIsAddingToCart(true);
      await addItem(variantId, 1);
      trackMetaAddToCart();
      setShowSuccess(true);
      openCartDrawer();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setErrorMessage("Failed to add item to cart. Please try again.");
      setShowError(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleIncreaseClick = async (e: React.MouseEvent) => {
    console.log("[ProductCard] increase click", {
      productHandle: product.handle,
      variantId,
      isComingSoon,
      isLoading,
      isAddingToCart,
    });
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || isComingSoon) return;

    try {
      setIsAddingToCart(true);
      await addItem(variantId, 1);
      trackMetaAddToCart();
      setShowSuccess(true);
      openCartDrawer();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setErrorMessage("Failed to update cart. Please try again.");
      setShowError(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDecreaseClick = async (e: React.MouseEvent) => {
    console.log("[ProductCard] decrease click", {
      productHandle: product.handle,
      variantId,
      hasCart: Boolean(cart?.id),
      isLoading,
      isAddingToCart,
    });
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || !cart) return;

    const cartLine = cart.lines.edges.find(
      ({ node }) => node.merchandise.id === variantId,
    )?.node;
    if (!cartLine) return;

    try {
      setIsAddingToCart(true);
      const nextQuantity = cartLine.quantity - 1;
      if (nextQuantity > 0) {
        await addItem(variantId, -1);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
      setErrorMessage("Failed to update cart. Please try again.");
      setShowError(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Sync local quantity with cart
  React.useEffect(() => {
    if (cart && variantId) {
      const cartLine = cart.lines.edges.find(
        ({ node }) => node.merchandise.id === variantId,
      )?.node;
      setLocalQuantity(cartLine?.quantity || 0);
    }
  }, [cart, variantId]);

  // Get sticker based on tags
  const getStickerImage = () => {
    if (!product.tags) return null;

    const lowerCaseTags = product.tags.map((tag) => tag.toLowerCase());

    if (
      lowerCaseTags.includes("bestseller") ||
      lowerCaseTags.includes("best seller")
    ) {
      return "/images/vectors/stickers/best_seller.png";
    }
    if (lowerCaseTags.includes("limited")) {
      return "/images/vectors/stickers/limited.png";
    }

    return null;
  };

  const stickerImage = getStickerImage();

  const controlHeight = { xs: 30, md: 48 };
  const iconSize = { xs: 18, md: 24 };

  const cartActionButtonSx = {
    flex: 1,
    bgcolor: "transparent",
    color: "background.default",
    height: controlHeight,
    px: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    boxShadow: "none",
    borderRadius: 2,
    "&:hover": {
      bgcolor: "primary.main",
      color: "background.default",
      boxShadow: "none",
    },
    "&:disabled": {
      bgcolor: "transparent",
      color: "grey.500",
      opacity: 0.5,
    },
  } as const;

  const qtyGroupSx = {
    bgcolor: "background.default",
    borderRadius: 2,
    height: controlHeight,
    boxShadow: `0px 3px 0px 0px`,
    boxShadowColor: "text.secondary",
    // border: 1,
    borderColor: "text.primary",
    overflow: "hidden",
    "& .MuiButtonGroup-grouped": {
      minWidth: { xs: 36, md: 50 },
      border: "none",
    },
  } as const;

  const qtyIconButtonSx = {
    height: "100%",
    borderRadius: 0,
    color: "text.secondary",
    "&:hover": {
      bgcolor: "primary.main",
      color: "background.default",
    },
    "&:disabled": {
      color: "grey.400",
    },
  } as const;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Link href={`/shop/${slug}`} passHref>
          <Box
            ref={cardRef}
            onClick={handleClick}
            sx={{
              width: size,
              position: "relative",
              height: height,
              borderRadius: 4,
              cursor: "pointer",
              overflow: "hidden",
              textDecoration: "none",
              bgcolor: "background.default",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(.97)",
                "& .product-image": {
                  transform: "translate(-50%, -50%) scale(1.07)",
                },
                "& h2": { transform: "translateY(0)" },
              },
            }}
          >
            <Box overflow="hidden" sx={{ width: "100%" }}>
              <Typography
                className="product-title"
                variant="h2"
                sx={{
                  position: "absolute",
                  bottom: "5%",
                  width: "100%",
                  textAlign: "center",
                  mt: 1,
                  px: 1,
                  color: "text.secondary",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: { xs: 12, md: 18 },
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                  transform: {
                    xs: "none",
                    md: "translateY(100px)",
                  },
                }}
              >
                {product.title}
              </Typography>
            </Box>

            {/* Sticker overlay */}
            {stickerImage && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: { xs: 60, sm: 80, md: 100 },
                  height: { xs: 60, sm: 80, md: 100 },
                  zIndex: 10,
                  pointerEvents: "none",
                  transform: "rotate(20deg)",
                }}
              >
                <Image
                  src={stickerImage}
                  alt="Product sticker"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 600px) 60px, (max-width: 900px) 80px, 100px"
                />
              </Box>
            )}

            <Box
              className="product-image"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "70%",
                transition: "transform 0.3s ease",
                transform: `translate(-50%, -50%) scale(1)`,
              }}
            >
              <Image
                src={
                  product.featuredImage?.url ||
                  product.images?.edges?.[0]?.node?.url ||
                  "/api/placeholder/300/350"
                }
                alt={altTag}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 600px) 200px, (max-width: 900px) 250px, 350px"
                loading="lazy"
              />
            </Box>
          </Box>
        </Link>
        {showControls && (
          <Box sx={{ width: size }}>
            <ButtonGroup
              variant="contained"
              sx={{
                mt: 2,
                width: "100%",
                borderRadius: 4,
                bgcolor: "secondary.main",
                boxShadow: "none",
                display: "flex",
                overflow: "hidden",
                justifyContent: "space-between",
                alignItems: "center",
                height: controlHeight,
                "& .MuiButtonGroup-grouped": {
                  border: "none",
                },
              }}
            >
              {/* Price Button (clickable) */}
              <Button
                href={`/shop/${slug}`}
                sx={{
                  height: "100%",
                  flexGrow: 0.7,
                  fontSize: { xs: ".7rem", md: "1rem" },
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "background.default",
                  bgcolor: "secondary.main",
                  boxShadow: "none",
                  minWidth: 0,
                  py: 0,
                  px: 2,
                  transition: "background 0.2s",
                  "&:hover": {
                    bgcolor: "primary.main",
                    boxShadow: "none",
                    color: "background.default",
                  },
                }}
              >
                {isComingSoon ? "COMING SOON" : `₹${Math.floor(price)}`}
                {/* COMING SOON */}
              </Button>

              {/* Cart Controls Button/Group */}
              {!isComingSoon &&
                (localQuantity === 0 ? (
                  <Button
                    onClick={handleAddToCartClick}
                    disabled={isAddingToCart || isLoading}
                    sx={cartActionButtonSx}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: iconSize,
                        height: iconSize,
                      }}
                    >
                      <Image
                        src="/images/vectors/cart.svg"
                        alt="Add to cart"
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="24px"
                      />
                    </Box>
                  </Button>
                ) : (
                  <ButtonGroup sx={qtyGroupSx}>
                    <IconButton
                      onClick={handleDecreaseClick}
                      disabled={isAddingToCart || isLoading}
                      size="small"
                      sx={qtyIconButtonSx}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Button
                      // disabled
                      sx={{
                        height: "100%",
                        color: "text.secondary",
                        fontWeight: 600,
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        minWidth: { xs: 40, md: 45 },
                        cursor: "default",
                        "&.Mui-disabled": {
                          color: "text.secondary",
                        },
                      }}
                    >
                      {localQuantity}
                    </Button>
                    <IconButton
                      onClick={handleIncreaseClick}
                      disabled={isAddingToCart || isLoading}
                      size="small"
                      sx={qtyIconButtonSx}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </ButtonGroup>
                ))}
            </ButtonGroup>
          </Box>
        )}
      </Box>
      <Snackbar
        open={showSuccess}
        autoHideDuration={2500}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Item added to cart!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
