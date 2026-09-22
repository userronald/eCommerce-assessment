import { useContext } from "react";
import { WishlistContext } from "../context/wishlist-context.js";

function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider.");
  }

  return context;
}

export { useWishlist };
