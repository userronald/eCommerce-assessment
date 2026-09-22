import { Link } from "react-router-dom";
import EmptyState from "./EmptyState.jsx";
import { safeImage, safeText } from "../utils/data.js";

const FALLBACK_IMAGE = "/favicon.svg";

function BrandGrid({ products = [] }) {
  const brands = Array.isArray(products)
    ? products.reduce((brandMap, product) => {
        const brand = safeText(product?.brand);
        if (!brand || brandMap.has(brand)) {
          return brandMap;
        }

        brandMap.set(
          brand,
          safeImage(product?.image || product?.images?.[0], FALLBACK_IMAGE),
        );
        return brandMap;
      }, new Map())
    : new Map();

  if (brands.size === 0) {
    return (
      <EmptyState
        description="Brand collections will appear when catalog data is available."
        title="No brands available"
      />
    );
  }

  return (
    <section aria-labelledby="brand-index-heading">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          Browse by maker
        </p>
        <h2
          className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
          id="brand-index-heading"
        >
          Find a brand you trust
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[...brands.entries()].map(([brand, image]) => (
          <Link
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            key={brand}
            to={`/shop?brand=${encodeURIComponent(brand)}`}
          >
            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
              <img
                alt=""
                className="h-full w-full object-cover grayscale transition duration-300 group-hover:scale-105 group-hover:grayscale-0"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
                src={image}
              />
            </div>
            <span className="block px-3 py-3 text-center text-sm font-semibold text-slate-900">
              {brand}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BrandGrid;
