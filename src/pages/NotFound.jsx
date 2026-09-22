import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <Link
        className="mt-6 inline-block text-sm font-semibold text-slate-900 underline"
        to="/"
      >
        Return home
      </Link>
    </section>
  );
}

export default NotFound;
