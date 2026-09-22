import { useState } from "react";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { safeText } from "../utils/data.js";

function CategoryForm({ initialCategory, isSaving, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    name: safeText(initialCategory?.name),
    slug: safeText(initialCategory?.slug),
    description: safeText(initialCategory?.description),
    image: safeText(initialCategory?.image),
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0)
      onSubmit({
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
      });
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <Input
        error={errors.name}
        id="category-name"
        label="Name"
        onChange={(event) => update("name", event.target.value)}
        value={form.name}
      />
      <Input
        error={errors.slug}
        id="category-slug"
        label="Slug"
        onChange={(event) => update("slug", event.target.value)}
        value={form.slug}
      />
      <Input
        id="category-image"
        label="Image URL"
        onChange={(event) => update("image", event.target.value)}
        value={form.image}
      />
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-slate-800"
          htmlFor="category-description"
        >
          Description
        </label>
        <textarea
          className="min-h-24 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          id="category-description"
          onChange={(event) => update("description", event.target.value)}
          value={form.description}
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button disabled={isSaving} type="submit">
          {isSaving ? "Saving..." : "Save category"}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
