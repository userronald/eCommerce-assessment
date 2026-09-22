import { useEffect, useState } from "react";
import { CartContext } from "./cart-context.js";
import { readStorage, writeStorage } from "../utils/storage.js";

const CART_STORAGE_KEY = "commerce-cart";
const COUPONS = {
  SAVE10: { code: "SAVE10", discountRate: 0.1 },
  SAVE20: { code: "SAVE20", discountRate: 0.2 },
};

function validCartItems(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      item.id != null &&
      Number.isFinite(Number(item.price)) &&
      Number.isFinite(Number(item.quantity)) &&
      Number(item.quantity) > 0,
  );
}

function CartProvider({ children }) {
  const storedCart = readStorage(CART_STORAGE_KEY, {});
  const [cartItems, setCartItems] = useState(() =>
    validCartItems(storedCart?.items ?? storedCart),
  );
  const [coupon, setCoupon] = useState(() => {
    const storedCoupon = storedCart?.coupon;
    return storedCoupon?.code && COUPONS[storedCoupon.code]
      ? COUPONS[storedCoupon.code]
      : null;
  });

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, { items: cartItems, coupon });
  }, [cartItems, coupon]);

  function addToCart(product, quantity = 1) {
    if (!product || product.id == null) {
      return;
    }

    const requestedQuantity = Math.max(1, Number(quantity) || 1);
    const availableStock = Number.isFinite(Number(product.stock))
      ? Number(product.stock)
      : Infinity;

    if (availableStock <= 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      const nextQuantity = Math.min(
        (existingItem?.quantity ?? 0) + requestedQuantity,
        availableStock,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: Math.min(requestedQuantity, availableStock),
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }

  function increaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const stockLimit = Number.isFinite(Number(item.stock))
          ? Number(item.stock)
          : Infinity;
        return {
          ...item,
          quantity: Math.min(item.quantity + 1, stockLimit),
        };
      }),
    );
  }

  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setCartItems([]);
    setCoupon(null);
  }

  function applyCoupon(code) {
    const normalizedCode =
      typeof code === "string" ? code.trim().toUpperCase() : "";
    const matchedCoupon = COUPONS[normalizedCode];

    if (!matchedCoupon) {
      return { success: false, reason: "invalid" };
    }

    if (coupon?.code === matchedCoupon.code) {
      return { success: false, reason: "already-applied" };
    }

    setCoupon(matchedCoupon);
    return { success: true, reason: "applied", coupon: matchedCoupon };
  }

  function removeCoupon() {
    setCoupon(null);
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );
  const discount = subtotal * (coupon?.discountRate ?? 0);
  const total = Math.max(0, subtotal - discount);

  const value = {
    cartItems,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartProvider };
