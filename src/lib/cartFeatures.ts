// src/lib/cartFeatures.ts
// Cart-related logic extracted from ProductCard for reuse

export async function handleAddToCart({
  e,
  variantId,
  isComingSoon,
  isOutOfStock,
  setIsAddingToCart,
  addItem,
  setLocalQuantity,
}: {
  e: React.MouseEvent;
  variantId: string | undefined;
  isComingSoon: boolean;
  isOutOfStock: boolean;
  setIsAddingToCart: (b: boolean) => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  setLocalQuantity: (fn: (prev: number) => number) => void;
}) {
  e.preventDefault();
  e.stopPropagation();
  if (!variantId || isComingSoon || isOutOfStock) return;
  setIsAddingToCart(true);
  try {
    await addItem(variantId, 1);
    setLocalQuantity((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to add to cart:", error);
  } finally {
    setIsAddingToCart(false);
  }
}

export async function handleIncrease({
  e,
  variantId,
  isComingSoon,
  isOutOfStock,
  setIsAddingToCart,
  addItem,
  setLocalQuantity,
}: {
  e: React.MouseEvent;
  variantId: string | undefined;
  isComingSoon: boolean;
  isOutOfStock: boolean;
  setIsAddingToCart: (b: boolean) => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  setLocalQuantity: (fn: (prev: number) => number) => void;
}) {
  e.preventDefault();
  e.stopPropagation();
  if (!variantId || isComingSoon || isOutOfStock) return;
  setIsAddingToCart(true);
  try {
    await addItem(variantId, 1);
    setLocalQuantity((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to add to cart:", error);
  } finally {
    setIsAddingToCart(false);
  }
}

export async function handleDecrease({
  e,
  variantId,
  localQuantity,
  setIsAddingToCart,
  cart,
  addItem,
  setLocalQuantity,
}: {
  e: React.MouseEvent;
  variantId: string | undefined;
  localQuantity: number;
  setIsAddingToCart: (b: boolean) => void;
  cart: import("@/lib/shopify").Cart | null;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  setLocalQuantity: (fn: (prev: number) => number) => void;
}) {
  e.preventDefault();
  e.stopPropagation();
  if (!variantId || localQuantity <= 0 || !cart) return;
  setIsAddingToCart(true);
  try {
    const cartLine = cart.lines.edges.find(
      ({ node }) => node.merchandise.id === variantId
    )?.node;
    if (cartLine) {
      const newQuantity = cartLine.quantity - 1;
      if (newQuantity > 0) {
        await addItem(variantId, -1);
      }
      setLocalQuantity((prev) => Math.max(0, prev - 1));
    }
  } catch (error) {
    console.error("Failed to update cart:", error);
  } finally {
    setIsAddingToCart(false);
  }
}
