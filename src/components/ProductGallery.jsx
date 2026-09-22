import { useState } from "react";

const FALLBACK_IMAGE = "/favicon.svg";

function ProductGallery({ alt = "Product image", images = [] }) {
  const safeImages = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = safeImages[selectedIndex] ?? FALLBACK_IMAGE;

  function handleImageError(event) {
    event.currentTarget.src = FALLBACK_IMAGE;
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
          src={selectedImage}
        />
      </div>
      <div
        aria-label="Product images"
        className="grid grid-cols-4 gap-3"
        role="list"
      >
        {safeImages.map((image, index) => (
          <button
            aria-label={`Show product image ${index + 1}`}
            aria-pressed={selectedIndex === index}
            className={`aspect-square overflow-hidden rounded-lg border-2 bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${selectedIndex === index ? "border-slate-950" : "border-transparent"}`}
            key={`${image}-${index}`}
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            <img
              alt=""
              className="h-full w-full object-cover"
              onError={handleImageError}
              src={image}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
