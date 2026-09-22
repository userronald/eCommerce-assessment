import { useCallback, useEffect, useState } from "react";
import AdminShell from "../components/AdminShell.jsx";
import Button from "../components/Button.jsx";
import CategoryForm from "../components/CategoryForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Modal from "../components/Modal.jsx";
import Toast from "../components/Toast.jsx";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/api.js";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalCategory, setModalCategory] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getCategories();
      setCategories(Array.isArray(response) ? response : []);
    } catch (requestError) {
      setError(requestError?.message ?? "We could not load categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    loadCategories();
  }, [loadCategories]);

  async function handleSave(category) {
    setIsSaving(true);
    try {
      if (isCreate) {
        const created = await createCategory(category);
        setCategories((current) => [...current, created]);
        setToast({ message: "Category created.", tone: "success" });
      } else {
        const updated = await updateCategory(modalCategory.id, {
          ...category,
          id: modalCategory.id,
        });
        setCategories((current) =>
          current.map((item) =>
            item.id === modalCategory.id ? updated : item,
          ),
        );
        setToast({ message: "Category updated.", tone: "success" });
      }
      setModalCategory(null);
    } catch (requestError) {
      setToast({
        message: requestError?.message ?? "Could not save category.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      setToast({ message: "Category deleted.", tone: "success" });
    } catch (requestError) {
      setToast({
        message: requestError?.message ?? "Could not delete category.",
        tone: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <AdminShell
      description="Organize the catalog into clear, manageable product groupings."
      title="Categories"
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
            Category catalog
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <Button
          onClick={() => {
            setIsCreate(true);
            setModalCategory({});
          }}
        >
          Add category
        </Button>
      </div>
      {error && <ErrorMessage message={error} onRetry={loadCategories} />}
      {!isLoading && !error && categories.length === 0 ? (
        <EmptyState
          description="Create a category to organize products."
          title="No categories yet"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <>
            {categories.map((category) => (
              <article
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                key={category.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {category.name || "Untitled category"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      /{category.slug || "missing-slug"}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {category.productCount ?? 0} products
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {category.description || "No description provided."}
                </p>
                <div className="mt-5 flex gap-2">
                  <Button
                    onClick={() => {
                      setIsCreate(false);
                      setModalCategory(category);
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteTarget(category)}
                    size="sm"
                    variant="danger"
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </>
        </div>
      )}
      <Modal
        onClose={() => setModalCategory(null)}
        open={Boolean(modalCategory)}
        title={isCreate ? "Add category" : "Edit category"}
      >
        <CategoryForm
          initialCategory={isCreate ? null : modalCategory}
          isSaving={isSaving}
          onCancel={() => setModalCategory(null)}
          onSubmit={handleSave}
        />
      </Modal>
      <ConfirmDialog
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        open={Boolean(deleteTarget)}
        title="Delete category?"
      >
        This permanently removes {deleteTarget?.name || "this category"} from
        the catalog.
      </ConfirmDialog>
    </AdminShell>
  );
}

export default AdminCategories;
