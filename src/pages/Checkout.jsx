import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Input from "../components/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useCart } from "../hooks/useCart.js";
import { createOrder } from "../services/api.js";
import { formatCurrency, safeText } from "../utils/data.js";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

function roundMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
}

function generateOrderId() {
  const suffix =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `order-${suffix}`;
}

function validateForm(form) {
  const errors = {};
  const requiredFields = [
    ["name", "Full name is required."],
    ["email", "Email is required."],
    ["phone", "Phone is required."],
    ["address", "Address is required."],
    ["city", "City is required."],
    ["state", "State is required."],
    ["postalCode", "Postal code is required."],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!form[field]?.trim()) {
      errors[field] = message;
    }
  });

  if (form.email?.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (form.phone?.trim() && !/^[\d\s()+-]{7,}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  return errors;
}

function Checkout() {
  const { currentUser } = useAuth();
  const { cartItems, clearCart, discount, subtotal, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <EmptyState
        action={
          <Button as={Link} to="/shop">
            Continue shopping
          </Button>
        }
        description="Add products to your cart before starting checkout."
        title="Checkout is unavailable"
      />
    );
  }

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const orderId = generateOrderId();
    const orderSubtotal = roundMoney(subtotal);
    const orderDiscount = roundMoney(discount);
    const orderTotal = roundMoney(total);
    const order = {
      id: orderId,
      orderId,
      userId: currentUser?.id ?? null,
      customerName: form.name.trim(),
      customerEmail: form.email.trim().toLowerCase(),
      customer: {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        shippingAddress: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
        },
      },
      items: cartItems.map((item) => ({
        productId: item.id,
        name: safeText(item?.name, "Untitled product"),
        brand: safeText(item?.brand),
        quantity: item.quantity,
        unitPrice: Number(item.price),
        total: roundMoney(Number(item.price) * item.quantity),
      })),
      subtotal: orderSubtotal,
      discount: orderDiscount,
      total: orderTotal,
      finalTotal: orderTotal,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const createdOrder = await createOrder(order);
      clearCart();
      navigate(
        `/order-confirmation/${encodeURIComponent(createdOrder?.id ?? orderId)}`,
      );
    } catch (requestError) {
      setSubmitError(
        requestError?.message ?? "We could not create your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          Almost there
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-3 text-slate-600">
          Enter your delivery details to place this simulated order.
        </p>
      </header>

      {submitError && <ErrorMessage message={submitError} />}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <form
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Delivery information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              No payment details are collected in this assessment.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              error={errors.name}
              id="checkout-name"
              label="Full name"
              onChange={(event) => updateField("name", event.target.value)}
              value={form.name}
            />
            <Input
              error={errors.email}
              id="checkout-email"
              label="Email"
              onChange={(event) => updateField("email", event.target.value)}
              type="email"
              value={form.email}
            />
            <Input
              error={errors.phone}
              id="checkout-phone"
              label="Phone"
              onChange={(event) => updateField("phone", event.target.value)}
              type="tel"
              value={form.phone}
            />
            <Input
              error={errors.city}
              id="checkout-city"
              label="City"
              onChange={(event) => updateField("city", event.target.value)}
              value={form.city}
            />
            <Input
              error={errors.state}
              id="checkout-state"
              label="State"
              onChange={(event) => updateField("state", event.target.value)}
              value={form.state}
            />
            <Input
              error={errors.postalCode}
              id="checkout-postal-code"
              label="Postal code"
              onChange={(event) =>
                updateField("postalCode", event.target.value)
              }
              value={form.postalCode}
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-slate-800"
              htmlFor="checkout-address"
            >
              Address
            </label>
            <textarea
              aria-invalid={Boolean(errors.address)}
              className={`min-h-28 w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 ${errors.address ? "border-rose-400" : "border-slate-300"}`}
              id="checkout-address"
              onChange={(event) => updateField("address", event.target.value)}
              value={form.address}
            />
            {errors.address && (
              <p className="text-xs font-medium text-rose-700" role="alert">
                {errors.address}
              </p>
            )}
          </div>
          <Button
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            {isSubmitting ? "Creating order..." : "Place order"}
          </Button>
        </form>

        <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Order summary
          </h2>
          <div className="space-y-3 border-b border-slate-200 pb-5">
            {cartItems.map((item) => (
              <div className="flex justify-between gap-4 text-sm" key={item.id}>
                <span className="min-w-0 text-slate-600">
                  {safeText(item?.name, "Untitled product")} ×{" "}
                  {item?.quantity ?? 1}
                </span>
                <span className="shrink-0 font-medium text-slate-950">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-slate-600">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-emerald-700">
              <dt>Discount</dt>
              <dd>− {formatCurrency(discount)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base font-semibold text-slate-950">
              <dt>Final total</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
