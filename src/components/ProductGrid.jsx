import EmptyState from "./EmptyState.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import LoadingSkeleton from "./LoadingSkeleton.jsx";
import ProductCard from "./ProductCard.jsx";

function ProductGrid({
  error,
  isWishlisted = () => false,
  isLoading,
  onAddToCart,
  onRetry,
  onToggleWishlist,
  products = [],
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        description="Try changing your search or filters."
        title="No products found"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          isWishlisted={isWishlisted(product)}
          key={product.id}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
