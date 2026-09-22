import { useState } from "react";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Input from "../components/Input.jsx";
import Toast from "../components/Toast.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { readStorage, writeStorage } from "../utils/storage.js";

const SUPPORT_STORAGE_KEY = "commerce-support-submissions";
const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

function validateForm(form) {
  const errors = {};
  Object.entries({
    name: "Name is required.",
    email: "Email is required.",
    subject: "Subject is required.",
    message: "Message is required.",
  }).forEach(([field, message]) => {
    if (!form[field].trim()) errors[field] = message;
  });

  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (form.message.trim() && form.message.trim().length < 10) {
    errors.message = "Please provide at least 10 characters.";
  }

  return errors;
}

function Support() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
    setStatus(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const existingSubmissions = readStorage(SUPPORT_STORAGE_KEY, []);
    const submissions = Array.isArray(existingSubmissions)
      ? existingSubmissions
      : [];
    const submission = {
      id: `support-${Date.now()}`,
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    const saved = writeStorage(SUPPORT_STORAGE_KEY, [
      ...submissions,
      submission,
    ]);
    setIsSubmitting(false);

    if (!saved) {
      setStatus({
        type: "error",
        message:
          "We could not save your message. Please check browser storage and try again.",
      });
      return;
    }

    setForm(EMPTY_FORM);
    setErrors({});
    setStatus({
      type: "success",
      message: "Thanks. Your support request has been saved.",
    });
  }

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          We are here to help
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Customer support
        </h1>
        <p className="mt-3 text-slate-600">
          Tell us what you need and we will make sure your question has
          somewhere to go.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <aside className="rounded-xl bg-slate-950 p-6 text-white sm:p-8">
          <h2 className="text-xl font-semibold">Before you write</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Include an order ID or product name when it is relevant. It helps us
            understand the situation faster.
          </p>
          <p className="mt-6 text-sm leading-6 text-slate-300">
            This frontend-only assessment stores submissions in your
            browser&apos;s LocalStorage. No external support service is
            contacted.
          </p>
        </aside>

        <form
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          onSubmit={handleSubmit}
        >
          {status?.type === "error" && (
            <ErrorMessage message={status.message} />
          )}
          {status?.type === "success" && (
            <Toast message={status.message} tone="success" />
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              error={errors.name}
              id="support-name"
              label="Name"
              onChange={(event) => updateField("name", event.target.value)}
              value={form.name}
            />
            <Input
              error={errors.email}
              id="support-email"
              label="Email"
              onChange={(event) => updateField("email", event.target.value)}
              type="email"
              value={form.email}
            />
          </div>
          <Input
            error={errors.subject}
            id="support-subject"
            label="Subject"
            onChange={(event) => updateField("subject", event.target.value)}
            value={form.subject}
          />
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-slate-800"
              htmlFor="support-message"
            >
              Message
            </label>
            <textarea
              aria-invalid={Boolean(errors.message)}
              className={`min-h-36 w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 ${errors.message ? "border-rose-400" : "border-slate-300"}`}
              id="support-message"
              onChange={(event) => updateField("message", event.target.value)}
              value={form.message}
            />
            {errors.message && (
              <p className="text-xs font-medium text-rose-700" role="alert">
                {errors.message}
              </p>
            )}
          </div>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Support;
