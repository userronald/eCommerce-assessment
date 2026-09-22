import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import { safeImage } from "../utils/data.js";

const FALLBACK_IMAGE = "/favicon.svg";

function HeroBanner({ image, isLoading }) {
  const heroImage = safeImage(image, FALLBACK_IMAGE);

  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg">
      <div className="absolute inset-0 -z-10">
        {!isLoading && (
          <img
            alt=""
            className="h-full w-full object-cover opacity-40"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
            src={heroImage}
          />
        )}
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>
      <div className="max-w-2xl px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
          Curated technology, thoughtfully chosen
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Make space for better everyday tech.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
          Discover dependable devices and considered desk essentials designed to
          work beautifully together.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} size="lg" to="/shop">
            Explore the shop
          </Button>
          <Button
            as={Link}
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            size="lg"
            to="/about"
            variant="secondary"
          >
            Our approach
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
