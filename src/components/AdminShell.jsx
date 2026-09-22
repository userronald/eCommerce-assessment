import { NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 ${isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`;

function AdminShell({ children, description, title }) {
  return (
    <div className="space-y-8">
      <header className="rounded-2xl bg-slate-950 px-6 py-8 text-white sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            {description}
          </p>
        )}
      </header>
      <nav
        aria-label="Admin navigation"
        className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
      >
        <NavLink className={navClass} end to="/admin">
          Overview
        </NavLink>
        <NavLink className={navClass} to="/admin/products">
          Products
        </NavLink>
        <NavLink className={navClass} to="/admin/categories">
          Categories
        </NavLink>
        <NavLink className={navClass} to="/admin/orders">
          Orders
        </NavLink>
      </nav>
      {children}
    </div>
  );
}

export default AdminShell;
