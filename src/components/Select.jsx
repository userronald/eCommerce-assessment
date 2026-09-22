function Select({ children, error, id, label, className = "", ...props }) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          className="block text-sm font-semibold text-slate-800"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <select
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={`min-h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 ${error ? "border-rose-400" : "border-slate-300"} ${className}`}
        id={id}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p
          className="text-xs font-medium text-rose-700"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
