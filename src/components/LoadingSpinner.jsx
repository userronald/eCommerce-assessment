function LoadingSpinner({ label = "Loading", size = "md" }) {
  const sizeClass =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";

  return (
    <span
      aria-label={label}
      className="inline-flex items-center gap-2"
      role="status"
    >
      <span
        aria-hidden="true"
        className={`animate-spin rounded-full border-2 border-slate-300 border-t-slate-950 ${sizeClass}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default LoadingSpinner;
