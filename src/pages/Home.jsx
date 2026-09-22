import { startTransition, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandGrid from "../components/BrandGrid.jsx";
import Button from "../components/Button.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import HeroBanner from "../components/HeroBanner.jsx";
import { useCart } from "../hooks/useCart.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { getProducts } from "../services/api.js";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { addToWishlist, hasItem, removeFromWishlist, wishlistItems } =
    useWishlist();

  const loadProducts = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
      setError("");
    }

    try {
      const response = await getProducts();
      startTransition(() => {
        setProducts(Array.isArray(response) ? response : []);
      });
    } catch (requestError) {
      startTransition(() => {
        setError(requestError?.message ?? "We could not load the catalog.");
      });
    } finally {
      startTransition(() => {
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    loadProducts(false);
  }, [loadProducts]);

  function toggleWishlist(product) {
    if (hasItem(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  const heroImage = products.find((product) => product?.featured)?.image;

  return (
    <div className="space-y-16 sm:space-y-20">
      <HeroBanner image={heroImage} isLoading={isLoading} />

      <FeaturedProducts
        error={error}
        isLoading={isLoading}
        onAddToCart={addToCart}
        onRetry={loadProducts}
        onToggleWishlist={toggleWishlist}
        products={products}
        wishlistItems={wishlistItems}
      />

      {!isLoading && !error && <BrandGrid products={products} />}

      <section className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-sky-100 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Ready when you are
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Find the right setup for your next day.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Compare the full collection by category, maker, and price.
          </p>
        </div>
        <Button as={Link} size="lg" to="/shop">
          Shop all products
        </Button>
      </section>
    </div>
  );
}

export default Home;
