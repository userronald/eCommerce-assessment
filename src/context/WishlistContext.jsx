import { useEffect, useState } from "react";
import { WishlistContext } from "./wishlist-context.js";
import { useCart } from "../hooks/useCart.js";
import { readStorage, writeStorage } from "../utils/storage.js";

const WISHLIST_STORAGE_KEY = "commerce-wishlist";

function validWishlistItems(value) {
  return Array.isArray(value)
    ? value.filter(
        (item) => item && typeof item === "object" && item.id != null,
      )
    : [];
}

function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() =>
    validWishlistItems(readStorage(WISHLIST_STORAGE_KEY, [])),
  );
  const { addToCart } = useCart();

  useEffect(() => {
    writeStorage(WISHLIST_STORAGE_KEY, wishlistItems);
  }, [wishlistItems]);

  function addToWishlist(product) {
    if (!product || product.id == null) {
      return;
    }

    setWishlistItems((currentItems) =>
      currentItems.some((item) => item.id === product.id)
        ? currentItems
        : [...currentItems, product],
    );
  }

  function removeFromWishlist(productId) {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }

  function hasItem(productId) {
    return wishlistItems.some((item) => item.id === productId);
  }

  function moveToCart(productId) {
    const item = wishlistItems.find(
      (wishlistItem) => wishlistItem.id === productId,
    );

    if (!item) {
      return false;
    }

    const stock = Number(item.stock);
    if (Number.isFinite(stock) && stock <= 0) {
      return false;
    }

    addToCart(item);
    removeFromWishlist(productId);
    return true;
  }

  function clearWishlist() {
    setWishlistItems([]);
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    hasItem,
    moveToCart,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export { WishlistProvider };
