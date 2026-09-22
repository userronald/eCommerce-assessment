import { Link } from "react-router-dom";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import { safeImage, safeNumber, safeText } from "../utils/data.js";

const FALLBACK_IMAGE = "/favicon.svg";

function WishlistCard({
  inCart,
  onAddToCart,
  onMoveToCart,
  onRemove,
  product,
}) {
  if (!product || product.id == null) {
    return null;
  }

  const image = safeImage(
    product?.image || product?.images?.[0],
    FALLBACK_IMAGE,
  );
  const name = safeText(product?.name, "Untitled product");
  const price = safeNumber(product?.price);
  const stock = safeNumber(product?.stock);
  const isOutOfStock = stock !== null && stock <= 0;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <Link
        className="h-28 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-28"
        to={`/product/${product.id}`}
      >
        <img
          alt={name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
          src={image}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2">
          {product.brand && <Badge tone="accent">{product.brand}</Badge>}
          {isOutOfStock ? (
            <Badge tone="danger">Out of stock</Badge>
          ) : (
            inCart && <Badge tone="success">Already in cart</Badge>
          )}
        </div>
        <Link
          className="mt-2 block break-words text-lg font-semibold text-slate-950 hover:underline"
          to={`/product/${product.id}`}
        >
          {name}
        </Link>
        <p className="mt-1 text-sm text-slate-600">
          {Number.isFinite(price)
            ? `$${price.toFixed(2)}`
            : "Price unavailable"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Button
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product)}
          size="sm"
        >
          {inCart ? "Add another" : "Add to cart"}
        </Button>
        <Button
          disabled={isOutOfStock}
          onClick={() => onMoveToCart(product.id)}
          size="sm"
          variant="secondary"
        >
          Move to cart
        </Button>
        <Button
          aria-label={`Remove ${name} from wishlist`}
          onClick={() => onRemove(product.id)}
          size="sm"
          variant="ghost"
        >
          Remove
        </Button>
      </div>
    </article>
  );
}

export default WishlistCard;
