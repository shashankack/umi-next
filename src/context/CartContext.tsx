"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  createCart,
  getCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  Cart,
  CartLineInput,
  CartLineUpdateInput,
  cartHelpers,
} from "@/lib/shopify";

// ========== TYPES ==========
interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateItemQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearError: () => void;
  refreshCart: () => Promise<void>;
}

// ========== CONTEXT ==========
const CartContext = createContext<CartContextValue | undefined>(undefined);

// ========== CONSTANTS ==========
const CART_ID_KEY = "umi_cart_id";

// ========== PROVIDER ==========
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  /**
   * Initialize cart from localStorage or create new one
   */
  const initializeCart = async () => {
    try {
      setIsLoading(true);
      const savedCartId = localStorage.getItem(CART_ID_KEY);

      if (savedCartId) {
        // Try to fetch existing cart
        const existingCart = await getCart(savedCartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          // Cart doesn't exist anymore, create new one
          await createNewCart();
        }
      } else {
        // No saved cart, create new one
        await createNewCart();
      }
    } catch (err) {
      console.error("Failed to initialize cart:", err);
      // If initialization fails, create a new cart
      await createNewCart();
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  /**
   * Create a new empty cart
   */
  const createNewCart = async () => {
    try {
      const newCart = await createCart([]);
      setCart(newCart);
      localStorage.setItem(CART_ID_KEY, newCart.id);
    } catch (err) {
      console.error("Failed to create cart:", err);
      setError("Failed to create cart");
    }
  };

  /**
   * Refresh cart data from Shopify
   */
  const refreshCart = useCallback(async () => {
    if (!cart?.id) return;

    try {
      const updatedCart = await getCart(cart.id);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      console.error("Failed to refresh cart:", err);
      setError("Failed to refresh cart");
    }
  }, [cart?.id]);

  /**
   * Add item to cart
   */
  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!cart?.id) {
        setError("Cart not initialized");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Check if item already exists in cart
        const existingLine = cartHelpers.findLineByVariant(cart, variantId);

        if (existingLine) {
          // Update existing line quantity
          const newQuantity = existingLine.quantity + quantity;
          const lines: CartLineUpdateInput[] = [
            {
              id: existingLine.id,
              quantity: newQuantity,
            },
          ];
          const updatedCart = await updateCartLines(cart.id, lines);
          setCart(updatedCart);
        } else {
          // Add new line
          const lines: CartLineInput[] = [
            cartHelpers.createCartLine(variantId, quantity),
          ];
          const updatedCart = await addToCart(cart.id, lines);
          setCart(updatedCart);
        }
      } catch (err) {
        console.error("Failed to add item:", err);
        setError("Failed to add item to cart");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) {
        setError("Cart not initialized");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const updatedCart = await removeFromCart(cart.id, [lineId]);
        setCart(updatedCart);
      } catch (err) {
        console.error("Failed to remove item:", err);
        setError("Failed to remove item from cart");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  /**
   * Update item quantity
   */
  const updateItemQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) {
        setError("Cart not initialized");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          await removeItem(lineId);
        } else {
          const lines: CartLineUpdateInput[] = [{ id: lineId, quantity }];
          const updatedCart = await updateCartLines(cart.id, lines);
          setCart(updatedCart);
        }
      } catch (err) {
        console.error("Failed to update item quantity:", err);
        setError("Failed to update item quantity");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cart, removeItem]
  );

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calculate item count
  const itemCount = cart?.totalQuantity || 0;

  const value: CartContextValue = {
    cart,
    isLoading,
    error,
    itemCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clearError,
    refreshCart,
  };

  // Don't render children until cart is initialized
  if (!isInitialized) {
    return null;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ========== HOOK ==========
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
