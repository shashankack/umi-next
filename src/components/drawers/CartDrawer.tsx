"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Divider,
  useMediaQuery,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useCart } from "@/context/CartContext";
import { cartHelpers, productHelpers } from "@/lib/shopify";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cart, isLoading, error, removeItem, updateItemQuantity, clearError } =
    useCart();

  const cartLines = cartHelpers.formatCartLines(cart);
  const isEmpty = cartHelpers.isEmpty(cart);
  const totals = cartHelpers.calculateCartTotals(cart);

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    try {
      await updateItemQuantity(lineId, newQuantity);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemove = async (lineId: string) => {
    try {
      await removeItem(lineId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: theme.palette.background.default,
          width: isMobile ? "100%" : 460,
          px: 3,
          py: 4,
          boxShadow: `-8px 0 18px rgba(0, 0, 0, 0.1)`,
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Gliker",
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Your Cart
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: theme.palette.primary.main, mr: 2 }}
          >
            <Box
              component="img"
              src="/images/vectors/close.svg"
              alt="Close"
              width={34}
            />
          </IconButton>
        </Stack>

        <Divider
          sx={{
            border: 1,
            borderRadius: 2,
            borderColor: theme.palette.secondary.main,
            mb: 3,
          }}
        />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Cart Items */}
        <Box flex={1} sx={{ maxHeight: 380, overflowY: "auto", mb: 2 }}>
          {isEmpty ? (
            <Stack alignItems="center" justifyContent="center" height="100%">
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                Your cart is empty
              </Typography>
              <Button
                onClick={onClose}
                href="/shop"
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: "primary.main",
                  color: "background.default",
                  fontFamily: "Bricolage",
                  fontWeight: 500,
                  fontSize: { xs: "4vw", md: "1rem" },
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: `0px 4px 0px 0px ${theme.palette.text.secondary}`,
                  "&:hover": {
                    bgcolor: "secondary.main",
                    color: "background.default",
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {cartLines.map((line) => (
                <Box key={line.id}>
                  <Stack direction="row" spacing={2}>
                    {/* Product Image */}
                    <Box
                      component="img"
                      src={line.variant.image?.url || "/api/placeholder/80/80"}
                      alt={line.product.title}
                      sx={{
                        width: 72,
                        height: 72,
                        objectFit: "cover",
                        borderRadius: 2,
                        bgcolor: "white",
                      }}
                    />

                    {/* Product Info */}
                    <Stack flex={1} spacing={1}>
                      <Link
                        href={`/shop/${line.product.handle}`}
                        onClick={onClose}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Bricolage",
                            fontSize: { xs: "3.8vw", md: "0.95vw" },
                            fontWeight: 600,
                            color: theme.palette.secondary.main,
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          {line.product.title}
                        </Typography>
                      </Link>

                      {/* Variant Options */}
                      {line.variant.selectedOptions.map((option) => (
                        <Typography
                          key={option.name}
                          variant="body2"
                          sx={{
                            fontFamily: "Bricolage",
                            fontSize: { xs: "3.5vw", md: "0.85vw" },
                            fontWeight: 400,
                            color: theme.palette.secondary.main,
                            mt: 0.2,
                          }}
                        >
                          {option.name}: {option.value}
                        </Typography>
                      ))}

                      {/* Quantity & Price */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Bricolage",
                            fontSize: { xs: "4.4vw", md: "1.05vw" },
                            fontWeight: 500,
                            color: theme.palette.primary.main,
                            mt: 0.5,
                          }}
                        >
                          {productHelpers.formatPrice(line.cost)}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mt={1}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              line.id,
                              Math.max(1, line.quantity - 1)
                            )
                          }
                          disabled={isLoading}
                          sx={{ color: theme.palette.secondary.main }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            fontFamily: "Bricolage",
                            color: theme.palette.secondary.main,
                            fontWeight: 600,
                            minWidth: 24,
                            textAlign: "center",
                          }}
                        >
                          {line.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(line.id, line.quantity + 1)
                          }
                          disabled={isLoading}
                          sx={{ color: theme.palette.secondary.main }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label="Remove item"
                          onClick={() => handleRemove(line.id)}
                          disabled={isLoading}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Divider
                    sx={{
                      mt: 2,
                      borderColor: theme.palette.secondary.main,
                      opacity: 0.3,
                    }}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer - Totals & Checkout */}
        {!isEmpty && totals && (
          <Box>
            <Divider
              sx={{
                border: 1,
                borderRadius: 2,
                borderColor: theme.palette.primary.main,
                mb: 1,
              }}
            />

            {/* Quantity & Subtotal */}
            <Stack direction="column" spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    fontSize: isMobile ? "4.4vw" : "1.05vw",
                    fontWeight: 500,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Qty
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    fontSize: isMobile ? "4.4vw" : "1.05vw",
                    fontWeight: 500,
                    color: theme.palette.primary.main,
                  }}
                >
                  {totals.itemCount}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    fontSize: isMobile ? "4.4vw" : "1.05vw",
                    fontWeight: 500,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Subtotal
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    fontSize: isMobile ? "4.4vw" : "1.05vw",
                    fontWeight: 500,
                    color: theme.palette.primary.main,
                  }}
                >
                  {productHelpers.formatPrice(totals.subtotal)}
                </Typography>
              </Stack>
            </Stack>

            {/* Tax (if available) */}
            {totals.tax && (
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    fontSize: isMobile ? "3.8vw" : "0.95vw",
                    fontWeight: 400,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Tax
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Bricolage",
                    fontSize: isMobile ? "3.8vw" : "0.95vw",
                    fontWeight: 400,
                    color: theme.palette.primary.main,
                  }}
                >
                  {productHelpers.formatPrice(totals.tax)}
                </Typography>
              </Stack>
            )}

            {/* Total */}
            <Stack direction="row" justifyContent="space-between" mb={3} mt={2}>
              <Typography
                sx={{
                  fontFamily: "Bricolage",
                  fontSize: isMobile ? "5vw" : "1.3rem",
                  fontWeight: 700,
                  color: theme.palette.secondary.main,
                }}
              >
                Total
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Bricolage",
                  fontSize: isMobile ? "5vw" : "1.3rem",
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                }}
              >
                {productHelpers.formatPrice(totals.total)}
              </Typography>
            </Stack>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: 1,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.background.default,
                fontFamily: "Bricolage",
                fontWeight: 600,
                fontSize: isMobile ? "4vw" : "1rem",
                "&:hover": {
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.background.default,
                },
                "&:disabled": {
                  bgcolor: "grey.400",
                  color: "grey.600",
                },
              }}
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                mt: 2,
                fontSize: { xs: "0.7rem", md: "0.75rem" },
                color: theme.palette.secondary.main,
                opacity: 0.7,
              }}
            >
              Shipping calculated at checkout
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
