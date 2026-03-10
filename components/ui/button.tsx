import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
}) {
  const variants = {
    primary: "bg-utvt-green text-white hover:bg-utvt-green-mid shadow-lg shadow-utvt-green/20",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20",
    outline: "border-2 border-utvt-green text-utvt-green hover:bg-utvt-green/5",
  };

  return (
    <button
      {...props}
      className={cn(
        "rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
