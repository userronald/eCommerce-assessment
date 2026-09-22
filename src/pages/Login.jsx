import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Input from "../components/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      const from = location.state?.from;
      const destination = from?.pathname?.startsWith("/")
        ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
        : "/";
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError?.message ?? "We could not sign you in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
        Welcome back
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        Sign in
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Use your Commerce demo account to continue.
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
          autoComplete="email"
          id="login-email"
          label="Email"
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          value={form.email}
        />
        <Input
          autoComplete="current-password"
          id="login-password"
          label="Password"
          onChange={(event) => updateField("password", event.target.value)}
          type="password"
          value={form.password}
        />
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Need an account?{" "}
        <Link className="font-semibold text-slate-950 underline" to="/register">
          Create one
        </Link>
      </p>
    </section>
  );
}

export default Login;
