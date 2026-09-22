import { startTransition, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import ShopFilters from "../components/ShopFilters.jsx";
import { useCart } from "../hooks/useCart.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { getProducts } from "../services/api.js";

const EMPTY_FILTERS = {
  search: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
};

function normalizeText(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function safePrice(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const price = Number(value);
  return Number.isFinite(price) ? price : null;
}

function uniqueValues(products, key) {
  return [
    ...new Set(
      products
        .map((product) => product?.[key])
        .filter((value) => typeof value === "string" && value.trim())
        .map((value) => value.trim()),
    ),
  ].sort((left, right) => left.localeCompare(right));
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
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

  const categories = uniqueValues(products, "category");
  const brands = uniqueValues(products, "brand");
  const activeFilters = {
    ...filters,
    brand: searchParams.get("brand")?.trim() ?? "",
  };
  const normalizedSearch = normalizeText(activeFilters.search);
  const normalizedCategory = normalizeText(activeFilters.category);
  const normalizedBrand = normalizeText(activeFilters.brand);
  const minimumPrice = safePrice(activeFilters.minPrice);
  const maximumPrice = safePrice(activeFilters.maxPrice);

  const filteredProducts = products
    .filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [product?.name, product?.brand, product?.category]
        .filter((value) => typeof value === "string")
        .join(" ");
      return normalizeText(searchableText).includes(normalizedSearch);
    })
    .filter((product) => {
      return (
        !normalizedCategory ||
        normalizeText(product?.category) === normalizedCategory
      );
    })
    .filter((product) => {
      return (
        !normalizedBrand || normalizeText(product?.brand) === normalizedBrand
      );
    })
    .filter((product) => {
      const price = safePrice(product?.price);
      if (price === null) {
        return minimumPrice === null && maximumPrice === null;
      }

      return (
        (minimumPrice === null || price >= minimumPrice) &&
        (maximumPrice === null || price <= maximumPrice)
      );
    });

  if (
    activeFilters.sort === "price-asc" ||
    activeFilters.sort === "price-desc"
  ) {
    filteredProducts.sort((left, right) => {
      const leftPrice = safePrice(left?.price);
      const rightPrice = safePrice(right?.price);

      if (leftPrice === null && rightPrice === null) return 0;
      if (leftPrice === null) return 1;
      if (rightPrice === null) return -1;
      return activeFilters.sort === "price-asc"
        ? leftPrice - rightPrice
        : rightPrice - leftPrice;
    });
  }

  function updateFilter(key, value) {
    if (key === "brand") {
      const nextParams = new URLSearchParams(searchParams);
      if (value) {
        nextParams.set("brand", value);
      } else {
        nextParams.delete("brand");
      }
      setSearchParams(nextParams, { replace: true });
      return;
    }

    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setSearchParams({}, { replace: true });
  }

  function toggleWishlist(product) {
    if (hasItem(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          The collection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Shop all products
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Search the catalog or narrow it down by category, brand, price, and
          sort order.
        </p>
      </header>

      <ShopFilters
        brands={brands}
        categories={categories}
        filters={activeFilters}
        onChange={updateFilter}
        onClear={clearFilters}
      />

      <div
        aria-live="polite"
        className="flex items-center justify-between gap-4"
      >
        <p className="text-sm font-medium text-slate-600">
          {isLoading
            ? "Loading products..."
            : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`}
        </p>
        {activeFilters.brand && (
          <p className="text-sm text-slate-500">
            Brand:{" "}
            <span className="font-semibold text-slate-900">
              {activeFilters.brand}
            </span>
          </p>
        )}
      </div>

      <ProductGrid
        error={error}
        isLoading={isLoading}
        isWishlisted={(product) =>
          wishlistItems.some((item) => item.id === product.id)
        }
        onAddToCart={addToCart}
        onRetry={loadProducts}
        onToggleWishlist={toggleWishlist}
        products={filteredProducts}
      />
    </div>
  );
}

export default Shop;
