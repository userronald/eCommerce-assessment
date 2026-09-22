import { forwardRef } from "react";

const variantClasses = {
  primary:
    "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-950",
  secondary:
    "border border-slate-300 bg-white text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:ring-slate-950",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-950",
  danger:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-600",
};

const sizeClasses = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

const Button = forwardRef(function Button(
  {
    as: Component = "button",
    children,
    className = "",
    size = "md",
    variant = "primary",
    ...props
  },
  ref,
) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Button;
