import { Link } from "react-router-dom";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import { safeImage, safeNumber, safeText } from "../utils/data.js";

function ProductCard({
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  product,
}) {
  if (!product) {
    return null;
  }

  const image = safeImage(product?.image || product?.images?.[0]);
  const productName = safeText(product?.name, "Untitled product");
  const price = safeNumber(product.price);
  const originalPrice = safeNumber(product.originalPrice);
  const stock = safeNumber(product.stock);
  const isOutOfStock = stock !== null && stock <= 0;
  const hasDiscount =
    price !== null && originalPrice !== null && originalPrice > price;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
        to={`/product/${product.id}`}
      >
        <img
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/favicon.svg";
          }}
          src={image}
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.featured && <Badge tone="accent">Featured</Badge>}
          {isOutOfStock && <Badge tone="danger">Out of stock</Badge>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {product.brand}
        </p>
        <Link
          className="mt-2 text-base font-semibold text-slate-950 hover:underline"
          to={`/product/${product.id}`}
        >
          {productName}
        </Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-slate-950">
            {price === null ? "Price unavailable" : `$${price.toFixed(2)}`}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-5">
          <Button
            className="flex-1"
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(product)}
            size="sm"
          >
            {isOutOfStock ? "Unavailable" : "Add to cart"}
          </Button>
          <Button
            aria-label={
              isWishlisted
                ? `Remove ${productName} from wishlist`
                : `Add ${productName} to wishlist`
            }
            onClick={() => onToggleWishlist?.(product)}
            size="sm"
            variant={isWishlisted ? "secondary" : "ghost"}
          >
            <span aria-hidden="true">{isWishlisted ? "♥" : "♡"}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
