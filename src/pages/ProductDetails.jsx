import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import Badge from "../components/Badge.jsx";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ProductGallery from "../components/ProductGallery.jsx";
import Toast from "../components/Toast.jsx";
import { useCart } from "../hooks/useCart.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { getProductById } from "../services/api.js";
import {
  FALLBACK_IMAGE,
  asArray,
  asObject,
  safeNumber,
  safeText,
} from "../utils/data.js";

function displayValue(value, fallback = "Not provided") {
  return value === null || value === undefined || value === ""
    ? fallback
    : String(value);
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, hasItem, removeFromWishlist } = useWishlist();

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setProduct(null);

    try {
      const response = await getProductById(id);
      startTransition(() => {
        setProduct(
          response && typeof response === "object"
            ? { ...response, id: response.id ?? id }
            : null,
        );
      });
    } catch (requestError) {
      startTransition(() => {
        setError(requestError?.message ?? "We could not load this product.");
      });
    } finally {
      startTransition(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const images = useMemo(() => {
    if (!product) {
      return [FALLBACK_IMAGE];
    }

    const productImages = [...asArray(product.images), product.image].filter(
      (image, index, allImages) => {
        return (
          typeof image === "string" &&
          image.trim() &&
          allImages.indexOf(image) === index
        );
      },
    );

    return productImages.length > 0 ? productImages : [FALLBACK_IMAGE];
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoadingSpinner label="Loading product details" size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return (
      <EmptyState
        action={
          <Button as={Link} to="/shop" variant="secondary">
            Return to shop
          </Button>
        }
        description="The requested product does not exist or is unavailable."
        title="Product not found"
      />
    );
  }

  const productName = safeText(product.name, "Untitled product");
  const price = safeNumber(product.price);
  const originalPrice = safeNumber(product.originalPrice);
  const stock = safeNumber(product.stock);
  const rating = safeNumber(product.rating);
  const hasDiscount =
    price !== null && originalPrice !== null && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isOutOfStock = stock !== null && stock <= 0;
  const maxQuantity = stock !== null && stock > 0 ? stock : 1;
  const isWishlisted = hasItem(product.id);
  const specifications = Object.entries(asObject(product.specifications));

  function changeQuantity(nextQuantity) {
    const normalizedQuantity = Number(nextQuantity);
    if (!Number.isFinite(normalizedQuantity)) {
      return;
    }

    setQuantity(
      Math.min(maxQuantity, Math.max(1, Math.floor(normalizedQuantity))),
    );
  }

  function handleAddToCart() {
    if (isOutOfStock || price === null) {
      return;
    }

    addToCart(product, quantity);
    setToast({
      message: `${productName} added to your cart.`,
      tone: "success",
    });
  }

  function handleWishlist() {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setToast({
        message: `${productName} removed from your wishlist.`,
        tone: "info",
      });
      return;
    }

    addToWishlist(product);
    setToast({
      message: `${productName} added to your wishlist.`,
      tone: "success",
    });
  }

  return (
    <div className="space-y-8">
      <Link
        className="inline-flex text-sm font-semibold text-slate-600 hover:text-slate-950 hover:underline"
        to="/shop"
      >
        ← Back to shop
      </Link>

      {toast && (
        <div className="fixed right-4 top-4 z-40 w-[min(24rem,calc(100vw-2rem))]">
          <Toast
            message={toast.message}
            onClose={() => setToast(null)}
            tone={toast.tone}
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
        <ProductGallery alt={productName} images={images} />

        <section aria-labelledby="product-title" className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {product.brand && <Badge tone="accent">{product.brand}</Badge>}
            {product.category && <Badge>{product.category}</Badge>}
            {product.featured && <Badge tone="success">Featured</Badge>}
          </div>
          <h1
            className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
            id="product-title"
          >
            {productName}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-slate-950">
              {price === null ? "Price unavailable" : `$${price.toFixed(2)}`}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-slate-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <Badge tone="success">Save {discountPercent}%</Badge>
              </>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
            <span>
              {rating === null
                ? "Rating unavailable"
                : `★ ${rating.toFixed(1)} / 5`}
            </span>
            <span aria-label="Stock status">
              {isOutOfStock
                ? "Out of stock"
                : stock === null
                  ? "Stock unavailable"
                  : `${stock} in stock`}
            </span>
          </div>
          <p className="mt-6 leading-7 text-slate-600">
            {safeText(
              product.description,
              "No product description is available yet.",
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-4">
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-800"
                htmlFor="product-quantity"
              >
                Quantity
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white">
                <Button
                  aria-label="Decrease quantity"
                  onClick={() => changeQuantity(quantity - 1)}
                  size="sm"
                  variant="ghost"
                >
                  −
                </Button>
                <input
                  aria-label="Product quantity"
                  className="w-12 border-0 bg-transparent text-center text-sm font-semibold text-slate-950 outline-none"
                  id="product-quantity"
                  inputMode="numeric"
                  min="1"
                  onChange={(event) => changeQuantity(event.target.value)}
                  type="number"
                  value={quantity}
                />
                <Button
                  aria-label="Increase quantity"
                  onClick={() => changeQuantity(quantity + 1)}
                  size="sm"
                  variant="ghost"
                >
                  +
                </Button>
              </div>
            </div>
            <Button
              className="flex-1"
              disabled={isOutOfStock || price === null}
              onClick={handleAddToCart}
              size="lg"
            >
              {isOutOfStock ? "Out of stock" : "Add to cart"}
            </Button>
            <Button onClick={handleWishlist} size="lg" variant="secondary">
              {isWishlisted ? "In wishlist" : "Add to wishlist"}
            </Button>
          </div>
        </section>
      </div>

      <section className="grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Specifications
          </h2>
          {specifications.length > 0 ? (
            <dl className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {specifications.map(([key, value]) => (
                <div className="grid gap-1 px-4 py-3 sm:grid-cols-2" key={key}>
                  <dt className="text-sm font-semibold capitalize text-slate-700">
                    {key.replace(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="break-words text-sm text-slate-600">
                    {displayValue(value)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No specifications are available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
