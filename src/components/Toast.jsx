const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
};

function Toast({ message, onClose, tone = "info" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm shadow-lg ${toneClasses[tone]}`}
      role="status"
    >
      <span>{message}</span>
      {onClose && (
        <button
          aria-label="Dismiss notification"
          className="rounded p-1 font-semibold hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}

export default Toast;
