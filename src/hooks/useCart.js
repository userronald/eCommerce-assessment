import { useContext } from "react";
import { CartContext } from "../context/cart-context.js";

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}

export { useCart };
