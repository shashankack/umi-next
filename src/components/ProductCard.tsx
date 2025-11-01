"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { slugify } from "../lib/slug";
import { useCart } from "@/context/CartContext";
import {
  handleAddToCart,
  handleIncrease,
  handleDecrease,
} from "@/lib/cartFeatures";
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
};

interface ProductCardProps {
  product: Product;
  size?:
    | number
    | { xs: number | string; sm: number | string; md: number | string }
    | string;
  showControls?: boolean;
  interactive?: boolean;
  sensitivity?: number;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = { xs: 200, sm: 250, md: 350 },
  showControls = false,
  interactive = false,
  sensitivity = 1,
  onProductClick,
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [localQuantity, setLocalQuantity] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem, cart, isLoading } = useCart();

  const slug = slugify(product.title);
  const height =
    typeof size === "object"
      ? Object.fromEntries(
          Object.entries(size).map(([k, v]) => [k, (v as number) * 1.3])
        )
      : (size as number) * 1.2;

  // Log the alt tag value for the product image
  const altTag = product.featuredImage?.altText || product.title;
  console.log("ProductCard alt tag:", altTag);

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    }
  };

  // Get product price and variant
  const price = product.priceRange?.minVariantPrice
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : 0;
  const firstVariant = product.variants?.edges?.[0]?.node;
  const variantId = firstVariant?.id;
  const isComingSoon = price === 0;

  // Check inventory status
  const isAvailableForSale = firstVariant?.availableForSale ?? false;
  const quantityAvailable = firstVariant?.quantityAvailable ?? 0;
  const isOutOfStock = !isAvailableForSale || quantityAvailable === 0;

  // Cart handlers are now imported from cartFeatures

  // Sync local quantity with cart
  React.useEffect(() => {
    if (cart && variantId) {
      const cartLine = cart.lines.edges.find(
        ({ node }) => node.merchandise.id === variantId
      )?.node;
      setLocalQuantity(cartLine?.quantity || 0);
    }
  }, [cart, variantId]);

  // Calculate transforms
  const cardTiltX =
    isHovered && interactive ? -mousePosition.y * 10 * sensitivity : 0; // Card tilts opposite, less than image
  const cardTiltY =
    isHovered && interactive ? mousePosition.x * 10 * sensitivity : 0; // Card tilts opposite, less than image
  const imageTiltX =
    isHovered && interactive ? -mousePosition.y * 20 * sensitivity : 0; // Image tilts toward cursor
  const imageTiltY =
    isHovered && interactive ? mousePosition.x * 20 * sensitivity : 0; // Image tilts toward cursor
  const imageScale = isHovered && interactive ? 1.1 : 1;

  return (
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
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            width: size,
            position: "relative",
            height: height,
            borderRadius: 4,
            cursor: "pointer",
            overflow: "hidden",
            textDecoration: "none",
            bgcolor: "background.default",
            transition: interactive
              ? "transform 0.1s ease-out"
              : "all 0.3s ease",
            transform: interactive
              ? `perspective(1000px) rotateX(${cardTiltX}deg) rotateY(${cardTiltY}deg) ${
                  isHovered ? "scale(0.95)" : "scale(1)"
                }`
              : "none",
            transformStyle: "preserve-3d",
            "&:hover": !interactive
              ? {
                  transform: "scale(.97)",
                  "& img": {
                    transform: "translate(-50%, -50%) scale(1.07)",
                  },
                  "& h2": { transform: "translateY(0)" },
                }
              : {
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
          <Box
            component="img"
            src={
              product.featuredImage?.url ||
              product.images?.edges?.[0]?.node?.url ||
              "/api/placeholder/300/350"
            }
            alt={product.featuredImage?.altText || product.title}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "70%",
              objectFit: "cover",
              transition: interactive
                ? "transform 0.2s ease-out"
                : "transform 0.3s ease",
              transform: interactive
                ? `translate(-50%, -50%) perspective(1000px) rotateX(${imageTiltX}deg) rotateY(${imageTiltY}deg) scale(${imageScale}) translateZ(50px)`
                : `translate(-50%, -50%) scale(1)`,
              transformStyle: "preserve-3d",
            }}
          />
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
              height: { xs: 30, md: 48 },
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
              {/* {isComingSoon ? "COMING SOON" : `₹${Math.floor(price)}`} */}
              COMING SOON
            </Button>

            {/* Cart Controls Button/Group */}
            {!isComingSoon &&
              (localQuantity === 0 ? (
                <Button
                  onClick={(e) =>
                    handleAddToCart({
                      e,
                      variantId,
                      isComingSoon,
                      isOutOfStock,
                      setIsAddingToCart,
                      addItem,
                      setLocalQuantity,
                    })
                  }
                  disabled={isAddingToCart || isLoading || isOutOfStock}
                  sx={{
                    flex: 1,
                    bgcolor: "transparent",
                    color: "background.default",
                    height: 48,
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
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      bgcolor: "transparent",
                      color: "grey.500",
                      opacity: 0.5,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/images/vectors/cart.svg"
                    alt="Add to cart"
                    sx={{
                      width: { xs: 18, md: 24 },
                      height: { xs: 18, md: 24 },
                    }}
                  />
                </Button>
              ) : (
                <ButtonGroup
                  sx={{
                    bgcolor: "background.default",
                    borderRadius: 2,
                    boxShadow: `0px 3px 0px 0px`,
                    boxShadowColor: "text.secondary",
                    border: 1,
                    borderColor: "text.primary",
                    "& .MuiButtonGroup-grouped": {
                      minWidth: "50px",
                    },
                  }}
                >
                  <IconButton
                    onClick={(e) =>
                      handleDecrease({
                        e,
                        variantId,
                        localQuantity,
                        setIsAddingToCart,
                        cart,
                        addItem,
                        setLocalQuantity,
                      })
                    }
                    disabled={isAddingToCart || isLoading}
                    size="small"
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "background.default",
                      },
                      "&:disabled": {
                        color: "grey.400",
                      },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Button
                    disabled
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: "1rem",
                      minWidth: "45px",
                      cursor: "default",
                      "&.Mui-disabled": {
                        color: "text.secondary",
                      },
                    }}
                  >
                    {localQuantity}
                  </Button>
                  <IconButton
                    onClick={(e) =>
                      handleIncrease({
                        e,
                        variantId,
                        isComingSoon,
                        isOutOfStock,
                        setIsAddingToCart,
                        addItem,
                        setLocalQuantity,
                      })
                    }
                    disabled={isAddingToCart || isLoading}
                    size="small"
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "background.default",
                      },
                      "&:disabled": {
                        color: "grey.400",
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </ButtonGroup>
              ))}
          </ButtonGroup>
        </Box>
      )}
    </Box>
  );
};

export default ProductCard;
