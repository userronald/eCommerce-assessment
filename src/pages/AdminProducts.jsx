import { useCallback, useEffect, useState } from "react";
import AdminShell from "../components/AdminShell.jsx";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Modal from "../components/Modal.jsx";
import ProductForm from "../components/ProductForm.jsx";
import Toast from "../components/Toast.jsx";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from "../services/api.js";
import { formatCurrency } from "../utils/data.js";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(Array.isArray(productResponse) ? productResponse : []);
      setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
    } catch (requestError) {
      setError(requestError?.message ?? "We could not load products.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    loadData();
  }, [loadData]);

  async function handleSave(product) {
    setIsSaving(true);
    try {
      if (isCreate) {
        const created = await createProduct(product);
        setProducts((current) => [...current, created]);
        setToast({ message: "Product created successfully.", tone: "success" });
      } else {
        const updated = await updateProduct(modalProduct.id, {
          ...product,
          id: modalProduct.id,
        });
        setProducts((current) =>
          current.map((item) => (item.id === modalProduct.id ? updated : item)),
        );
        setToast({ message: "Product updated successfully.", tone: "success" });
      }
      setModalProduct(null);
    } catch (requestError) {
      setToast({
        message: requestError?.message ?? "Could not save product.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      setToast({ message: "Product deleted.", tone: "success" });
    } catch (requestError) {
      setToast({
        message: requestError?.message ?? "Could not delete product.",
        tone: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <AdminShell
      description="Create, edit, and maintain the catalog used by the storefront."
      title="Products"
    >
      {toast && (
        <div className="fixed right-4 top-4 z-40 w-[min(24rem,calc(100vw-2rem))]">
          <Toast
            message={toast.message}
            onClose={() => setToast(null)}
            tone={toast.tone}
          />
        </div>
      )}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Product catalog
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          onClick={() => {
            setIsCreate(true);
            setModalProduct({});
          }}
        >
          Add product
        </Button>
      </div>
      {error && <ErrorMessage message={error} onRetry={loadData} />}
      {!isLoading && !error && products.length === 0 ? (
        <EmptyState
          description="Create the first product to populate the storefront."
          title="No products yet"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Product catalog management</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">
                      {product.name || "Untitled product"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.brand || "No brand"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {product.category || "Uncategorized"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {formatCurrency(product.price, "Unavailable")}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {product.stock ?? "Unknown"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsCreate(false);
                          setModalProduct(product);
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setDeleteTarget(product)}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        onClose={() => setModalProduct(null)}
        open={Boolean(modalProduct)}
        title={isCreate ? "Add product" : "Edit product"}
      >
        <ProductForm
          categories={categories}
          initialProduct={isCreate ? null : modalProduct}
          isSaving={isSaving}
          onCancel={() => setModalProduct(null)}
          onSubmit={handleSave}
        />
      </Modal>
      <ConfirmDialog
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        open={Boolean(deleteTarget)}
        title="Delete product?"
      >
        This permanently removes {deleteTarget?.name || "this product"} from the
        catalog.
      </ConfirmDialog>
    </AdminShell>
  );
}

export default AdminProducts;
