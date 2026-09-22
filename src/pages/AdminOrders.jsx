import { useCallback, useEffect, useState } from "react";
import AdminShell from "../components/AdminShell.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { getOrders } from "../services/api.js";
import {
  asArray,
  formatCurrency,
  safeDate,
  safeNumber,
  safeText,
} from "../utils/data.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getOrders();
      setOrders(asArray(response));
    } catch (requestError) {
      setError(requestError?.message ?? "We could not load orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    loadOrders();
  }, [loadOrders]);

  return (
    <AdminShell
      description="Orders created through checkout appear here for review. This ledger is read-only."
      title="Orders"
    >
      {error && <ErrorMessage message={error} onRetry={loadOrders} />}
      {isLoading ? (
        <LoadingSkeleton className="h-48" lines={3} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Orders will appear after a customer completes checkout."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Read-only order ledger</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order, index) => (
                <tr key={order?.id ?? order?.orderId ?? `order-${index}`}>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600">
                    {safeText(order?.orderId || order?.id, "Unknown order")}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">
                      {safeText(
                        order?.customerName || order?.customer?.name,
                        "Guest",
                      )}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {safeText(
                        order?.customerEmail || order?.customer?.email,
                        "No email",
                      )}
                    </p>
                  </td>
                  <td className="max-w-xs px-4 py-4 text-slate-600">
                    {asArray(order?.items).length > 0
                      ? asArray(order?.items)
                          .map(
                            (item) =>
                              `${safeText(item?.name, "Item")} × ${safeNumber(item?.quantity, 1)}`,
                          )
                          .join(", ")
                      : "No items"}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    {formatCurrency(
                      order?.finalTotal ?? order?.total,
                      "Unavailable",
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {safeText(order?.status, "Unknown")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {safeDate(order?.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

export default AdminOrders;
