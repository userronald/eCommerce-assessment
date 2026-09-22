import { Link, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";

function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Order placed
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Thanks for your order.
      </h1>
      <p className="mt-4 text-slate-700">
        Your simulated order has been created and is now pending fulfillment.
      </p>
      <p className="mt-5 text-sm text-slate-600">
        Order ID:{" "}
        <strong className="text-slate-950">{orderId || "Unavailable"}</strong>
      </p>
      <Button as={Link} className="mt-8" to="/shop">
        Continue shopping
      </Button>
    </section>
  );
}

export default OrderConfirmation;
