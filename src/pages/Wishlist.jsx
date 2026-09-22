import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Toast from "../components/Toast.jsx";
import WishlistCard from "../components/WishlistCard.jsx";
import { useCart } from "../hooks/useCart.js";
import { useWishlist } from "../hooks/useWishlist.js";

function Wishlist() {
  const { addToCart, cartItems } = useCart();
  const { clearWishlist, moveToCart, removeFromWishlist, wishlistItems } =
    useWishlist();
  const [toast, setToast] = useState(null);

  function showToast(message, tone = "success") {
    setToast({ message, tone });
  }

  function handleAddToCart(product) {
    addToCart(product);
    showToast(`${product.name?.trim() || "Product"} added to your cart.`);
  }

  function handleMoveToCart(productId) {
    const moved = moveToCart(productId);
    if (moved) {
      showToast("Product moved to your cart.");
    } else {
      showToast("This product is unavailable and cannot be moved.", "error");
    }
  }

  function handleRemove(productId) {
    removeFromWishlist(productId);
    showToast("Product removed from your wishlist.", "info");
  }

  if (wishlistItems.length === 0) {
    return (
      <EmptyState
        action={
          <Button as={Link} to="/shop">
            Explore products
          </Button>
        }
        description="Save products you want to compare or come back to later."
        title="Your wishlist is empty"
      />
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed right-4 top-4 z-40 w-[min(24rem,calc(100vw-2rem))]">
          <Toast
            message={toast.message}
            onClose={() => setToast(null)}
            tone={toast.tone}
          />
        </div>
      )}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Saved for later
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Wishlist
          </h1>
          <p className="mt-3 text-slate-600">
            Keep an eye on products you may want to bring home.
          </p>
        </div>
        <Button onClick={clearWishlist} size="sm" variant="secondary">
          Clear wishlist
        </Button>
      </header>

      <section aria-label="Wishlist products" className="space-y-4">
        {wishlistItems.map((product) => (
          <WishlistCard
            inCart={cartItems.some((item) => item.id === product.id)}
            key={product.id}
            onAddToCart={handleAddToCart}
            onMoveToCart={handleMoveToCart}
            onRemove={handleRemove}
            product={product}
          />
        ))}
      </section>
    </div>
  );
}

export default Wishlist;
