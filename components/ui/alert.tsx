import { cn } from "@/lib/utils";

export function Alert({
  message,
  variant = "error",
}: {
  message: string;
  variant?: "error" | "success" | "info";
}) {
  const variants = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-sky-200 bg-sky-50 text-sky-700",
  };

  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", variants[variant])}>
      {message}
    </div>
  );
}
