import { useState } from "react";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Select from "./Select.jsx";
import { asObject, safeText } from "../utils/data.js";

const EMPTY_PRODUCT = {
  name: "",
  brand: "",
  category: "",
  price: "",
  originalPrice: "",
  image: "",
  description: "",
  specifications: "{}",
  rating: "",
  stock: "",
  featured: false,
};

function productToForm(product) {
  if (!product) return EMPTY_PRODUCT;
  return {
    ...EMPTY_PRODUCT,
    ...product,
    name: safeText(product.name),
    brand: safeText(product.brand),
    category: safeText(product.category),
    image: safeText(product.image),
    description: safeText(product.description),
    price: product.price ?? "",
    originalPrice: product.originalPrice ?? "",
    rating: product.rating ?? "",
    stock: product.stock ?? "",
    specifications: JSON.stringify(asObject(product.specifications), null, 2),
  };
}

function validateProduct(form) {
  const errors = {};
  ["name", "brand", "category"].forEach((field) => {
    if (!form[field].trim()) errors[field] = `${field} is required.`;
  });
  ["price", "stock"].forEach((field) => {
    if (
      form[field] === "" ||
      !Number.isFinite(Number(form[field])) ||
      Number(form[field]) < 0
    ) {
      errors[field] = "Enter a valid non-negative number.";
    }
  });
  if (
    form.originalPrice !== "" &&
    (!Number.isFinite(Number(form.originalPrice)) ||
      Number(form.originalPrice) < 0)
  ) {
    errors.originalPrice = "Enter a valid non-negative number.";
  }
  if (
    form.rating !== "" &&
    (!Number.isFinite(Number(form.rating)) ||
      Number(form.rating) < 0 ||
      Number(form.rating) > 5)
  ) {
    errors.rating = "Rating must be between 0 and 5.";
  }
  try {
    JSON.parse(form.specifications || "{}");
  } catch {
    errors.specifications = "Specifications must be valid JSON.";
  }
  return errors;
}

function ProductForm({
  categories = [],
  initialProduct,
  isSaving,
  onCancel,
  onSubmit,
}) {
  const [form, setForm] = useState(() => productToForm(initialProduct));
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      ...form,
      price: Number(form.price),
      originalPrice:
        form.originalPrice === ""
          ? Number(form.price)
          : Number(form.originalPrice),
      rating: form.rating === "" ? 0 : Number(form.rating),
      stock: Number(form.stock),
      specifications: JSON.parse(form.specifications || "{}"),
      featured: Boolean(form.featured),
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.name}
          id="product-name"
          label="Name"
          onChange={(event) => updateField("name", event.target.value)}
          value={form.name}
        />
        <Input
          error={errors.brand}
          id="product-brand-admin"
          label="Brand"
          onChange={(event) => updateField("brand", event.target.value)}
          value={form.brand}
        />
        <Select
          error={errors.category}
          id="product-category-admin"
          label="Category"
          onChange={(event) => updateField("category", event.target.value)}
          value={form.category}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input
          error={errors.price}
          id="product-price-admin"
          label="Price"
          min="0"
          onChange={(event) => updateField("price", event.target.value)}
          step="0.01"
          type="number"
          value={form.price}
        />
        <Input
          error={errors.originalPrice}
          id="product-original-price"
          label="Original price"
          min="0"
          onChange={(event) => updateField("originalPrice", event.target.value)}
          step="0.01"
          type="number"
          value={form.originalPrice}
        />
        <Input
          error={errors.stock}
          id="product-stock-admin"
          label="Stock"
          min="0"
          onChange={(event) => updateField("stock", event.target.value)}
          step="1"
          type="number"
          value={form.stock}
        />
        <Input
          error={errors.rating}
          id="product-rating-admin"
          label="Rating"
          max="5"
          min="0"
          onChange={(event) => updateField("rating", event.target.value)}
          step="0.1"
          type="number"
          value={form.rating}
        />
        <Input
          id="product-image-admin"
          label="Image URL"
          onChange={(event) => updateField("image", event.target.value)}
          value={form.image}
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-slate-800"
          htmlFor="product-description-admin"
        >
          Description
        </label>
        <textarea
          className="min-h-24 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          id="product-description-admin"
          onChange={(event) => updateField("description", event.target.value)}
          value={form.description}
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-slate-800"
          htmlFor="product-specifications-admin"
        >
          Specifications JSON
        </label>
        <textarea
          aria-invalid={Boolean(errors.specifications)}
          className={`min-h-32 w-full rounded-lg border px-3.5 py-3 font-mono text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 ${errors.specifications ? "border-rose-400" : "border-slate-300"}`}
          id="product-specifications-admin"
          onChange={(event) =>
            updateField("specifications", event.target.value)
          }
          value={form.specifications}
        />
        {errors.specifications && (
          <p className="text-xs font-medium text-rose-700" role="alert">
            {errors.specifications}
          </p>
        )}
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold text-slate-800">
        <input
          checked={form.featured}
          className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
          onChange={(event) => updateField("featured", event.target.checked)}
          type="checkbox"
        />
        Featured product
      </label>
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button disabled={isSaving} type="submit">
          {isSaving ? "Saving..." : "Save product"}
        </Button>
      </div>
    </form>
  );
}

export { EMPTY_PRODUCT };
export default ProductForm;
