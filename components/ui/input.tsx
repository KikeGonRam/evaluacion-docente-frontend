import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const baseStyles = "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-300 focus:border-utvt-green focus:ring-4 focus:ring-utvt-green/5 focus:shadow-sm";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(baseStyles, props.className)}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(baseStyles, "min-h-[140px] resize-none", props.className)}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(baseStyles, "appearance-none cursor-pointer pr-10", props.className)}
    />
  );
}
