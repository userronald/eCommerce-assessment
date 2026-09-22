import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import { safeImage, safeNumber, safeText } from "../utils/data.js";

const FALLBACK_IMAGE = "/favicon.svg";

function CartItem({ item, onDecrease, onIncrease, onRemove }) {
  const image = safeImage(item?.image || item?.images?.[0], FALLBACK_IMAGE);
  const name = safeText(item?.name, "Untitled product");
  const price = safeNumber(item?.price);
  const itemTotal = Number.isFinite(price) ? price * item.quantity : 0;
  const stock = safeNumber(item?.stock);
  const atStockLimit = Number.isFinite(stock) && item.quantity >= stock;

  return (
    <article className="flex flex-col gap-4 border-b border-slate-200 py-5 first:pt-0 sm:flex-row sm:items-center">
      <Link
        className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100"
        to={`/product/${item.id}`}
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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {item.brand || "Catalog item"}
        </p>
        <Link
          className="mt-1 block truncate text-base font-semibold text-slate-950 hover:underline"
          to={`/product/${item.id}`}
        >
          {name}
        </Link>
        <p className="mt-1 text-sm text-slate-600">
          {Number.isFinite(price)
            ? `$${price.toFixed(2)} each`
            : "Price unavailable"}
        </p>
      </div>
      <div className="flex items-center justify-between gap-5 sm:justify-end">
        <div className="flex items-center rounded-lg border border-slate-300 bg-white">
          <Button
            aria-label={`Decrease quantity for ${name}`}
            disabled={item.quantity <= 1}
            onClick={() => onDecrease(item.id)}
            size="sm"
            variant="ghost"
          >
            −
          </Button>
          <span
            aria-label={`Quantity: ${item.quantity}`}
            className="w-9 text-center text-sm font-semibold text-slate-950"
          >
            {item.quantity}
          </span>
          <Button
            aria-label={`Increase quantity for ${name}`}
            disabled={atStockLimit}
            onClick={() => onIncrease(item.id)}
            size="sm"
            variant="ghost"
          >
            +
          </Button>
        </div>
        <p className="min-w-20 text-right text-sm font-semibold text-slate-950">
          ${itemTotal.toFixed(2)}
        </p>
        <Button
          aria-label={`Remove ${name} from cart`}
          onClick={() => onRemove(item.id)}
          size="sm"
          variant="ghost"
        >
          <span aria-hidden="true">×</span>
        </Button>
      </div>
    </article>
  );
}

export default CartItem;
