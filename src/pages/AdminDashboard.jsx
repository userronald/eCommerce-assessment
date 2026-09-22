import { useCallback, useEffect, useState } from "react";
import AdminShell from "../components/AdminShell.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { getCategories, getOrders, getProducts } from "../services/api.js";
import { formatCurrency } from "../utils/data.js";

function AdminDashboard() {
  const [data, setData] = useState({
    products: [],
    categories: [],
    orders: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [products, categories, orders] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
      ]);
      setData({
        products: Array.isArray(products) ? products : [],
        categories: Array.isArray(categories) ? categories : [],
        orders: Array.isArray(orders) ? orders : [],
      });
    } catch (requestError) {
      setError(requestError?.message ?? "We could not load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    loadDashboard();
  }, [loadDashboard]);

  const revenue = data.orders.reduce(
    (sum, order) => sum + (Number(order?.finalTotal ?? order?.total) || 0),
    0,
  );
  const cards = [
    ["Products", data.products.length, "Catalog items"],
    ["Categories", data.categories.length, "Product groupings"],
    ["Orders", data.orders.length, "Recorded orders"],
    ["Revenue", formatCurrency(revenue), "Order value"],
  ];

  return (
    <AdminShell
      description="A quick view of the current catalog and order activity."
      title="Dashboard"
    >
      {error && <ErrorMessage message={error} onRetry={loadDashboard} />}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <LoadingSkeleton key={index} className="h-32" lines={1} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, value, detail]) => (
            <article
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              key={label}
            >
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{detail}</p>
            </article>
          ))}
        </div>
      )}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Admin workspace
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use the navigation above to manage products and categories or review
          the read-only order ledger.
        </p>
      </section>
    </AdminShell>
  );
}

export default AdminDashboard;
