import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Input from "../components/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (registerError) {
      setError(registerError?.message ?? "We could not create your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
        Join Commerce
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        Create an account
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Create a customer account to save products and complete checkout.
      </p>
      {error && (
        <div className="mt-5">
          <ErrorMessage message={error} />
        </div>
      )}
      <form
        aria-busy={isSubmitting}
        className="mt-6 space-y-5"
        onSubmit={handleSubmit}
      >
        <Input
          autoComplete="name"
          id="register-name"
          label="Full name"
          onChange={(event) => updateField("name", event.target.value)}
          value={form.name}
        />
        <Input
          autoComplete="email"
          id="register-email"
          label="Email"
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          value={form.email}
        />
        <Input
          autoComplete="new-password"
          id="register-password"
          label="Password"
          onChange={(event) => updateField("password", event.target.value)}
          type="password"
          value={form.password}
        />
        <Input
          autoComplete="new-password"
          id="register-confirm-password"
          label="Confirm password"
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          type="password"
          value={form.confirmPassword}
        />
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-semibold text-slate-950 underline" to="/login">
          Sign in
        </Link>
      </p>
    </section>
  );
}

export default Register;
