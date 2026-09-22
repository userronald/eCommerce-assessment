function LoadingSkeleton({ className = "", lines = 3 }) {
  return (
    <div
      aria-label="Loading content"
      className={`animate-pulse space-y-3 ${className}`}
      role="status"
    >
      <div className="h-48 rounded-xl bg-slate-200" />
      {Array.from({ length: lines }, (_, index) => (
        <div
          className={`h-4 rounded bg-slate-200 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
          key={index}
        />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
