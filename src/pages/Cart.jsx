import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import CartItem from "../components/CartItem.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Input from "../components/Input.jsx";
import { useCart } from "../hooks/useCart.js";
import { formatCurrency } from "../utils/data.js";

function Cart() {
  const {
    applyCoupon,
    cartItems,
    coupon,
    decreaseQuantity,
    discount,
    increaseQuantity,
    removeFromCart,
    removeCoupon,
    subtotal,
    total,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState(null);

  function handleApplyCoupon(event) {
    event.preventDefault();
    const result = applyCoupon(couponCode);

    if (result.reason === "invalid") {
      setCouponMessage({
        tone: "error",
        text: "That coupon code is not valid.",
      });
    } else if (result.reason === "already-applied") {
      setCouponMessage({
        tone: "info",
        text: "That coupon is already applied.",
      });
    } else {
      setCouponMessage({
        tone: "success",
        text: `${result.coupon.code} applied successfully.`,
      });
      setCouponCode("");
    }
  }

  function handleRemoveCoupon() {
    removeCoupon();
    setCouponMessage({ tone: "info", text: "Coupon removed." });
  }

  if (cartItems.length === 0) {
    return (
      <EmptyState
        action={
          <Button as={Link} to="/shop">
            Continue shopping
          </Button>
        }
        description="Add something useful to your cart and it will appear here."
        title="Your cart is empty"
      />
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          Your order
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Shopping cart
        </h1>
        <p className="mt-3 text-slate-600">
          Review your items, adjust quantities, and apply a demonstration
          coupon.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section
          aria-labelledby="cart-items-heading"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2
            className="text-lg font-semibold text-slate-950"
            id="cart-items-heading"
          >
            Cart items
          </h2>
          <div className="mt-5">
            {cartItems.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                onDecrease={decreaseQuantity}
                onIncrease={increaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
          <Link
            className="mt-6 inline-flex text-sm font-semibold text-slate-600 hover:text-slate-950 hover:underline"
            to="/shop"
          >
            ← Continue shopping
          </Link>
        </section>

        <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Order summary
          </h2>
          <form className="space-y-3" onSubmit={handleApplyCoupon}>
            <Input
              helpText="Try SAVE10 or SAVE20. Codes are not case-sensitive."
              id="coupon-code"
              label="Coupon code"
              onChange={(event) => {
                setCouponCode(event.target.value);
                setCouponMessage(null);
              }}
              placeholder="Enter code"
              value={couponCode}
            />
            <Button className="w-full" type="submit" variant="secondary">
              Apply coupon
            </Button>
            {couponMessage && (
              <p
                className={`text-sm ${couponMessage.tone === "error" ? "text-rose-700" : couponMessage.tone === "success" ? "text-emerald-700" : "text-slate-600"}`}
                role="status"
              >
                {couponMessage.text}
              </p>
            )}
          </form>
          {coupon && (
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <span>{coupon.code} applied</span>
              <button
                className="rounded px-1 font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
                onClick={handleRemoveCoupon}
                type="button"
              >
                Remove
              </button>
            </div>
          )}
          <dl className="space-y-3 border-t border-slate-200 pt-5 text-sm">
            <div className="flex justify-between gap-4 text-slate-600">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-emerald-700">
              <dt>Discount</dt>
              <dd>− {formatCurrency(discount)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base font-semibold text-slate-950">
              <dt>Total</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
          </dl>
          <Button as={Link} className="w-full" to="/checkout" size="lg">
            Proceed to checkout
          </Button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
