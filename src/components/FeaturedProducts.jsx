import ProductGrid from "./ProductGrid.jsx";

function FeaturedProducts({
  error,
  isLoading,
  onAddToCart,
  onRetry,
  onToggleWishlist,
  products,
  wishlistItems,
}) {
  const featuredProducts = Array.isArray(products)
    ? products.filter((product) => product?.featured === true)
    : [];
  const wishlistIds = new Set(
    Array.isArray(wishlistItems) ? wishlistItems.map((item) => item.id) : [],
  );

  return (
    <section aria-labelledby="featured-products-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Staff picks
          </p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="featured-products-heading"
          >
            Featured products
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          A short list of customer-ready essentials from the current catalog.
        </p>
      </div>
      <ProductGrid
        error={error}
        isLoading={isLoading}
        isWishlisted={(product) => wishlistIds.has(product.id)}
        onAddToCart={onAddToCart}
        onRetry={onRetry}
        onToggleWishlist={onToggleWishlist}
        products={featuredProducts}
      />
    </section>
  );
}

export default FeaturedProducts;
