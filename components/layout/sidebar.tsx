"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/evaluaciones", label: "Evaluaciones" },
  { href: "/docentes", label: "Docentes" },
  { href: "/cuestionarios", label: "Cuestionarios" },
  { href: "/estudiantes", label: "Estudiantes" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white px-4 py-4 lg:min-h-screen lg:w-72 lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          Evaluación Docente
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Panel Administrativo
        </h1>
      </div>

      <nav className="grid gap-2">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-sm text-slate-200">
        <p className="font-medium">Backend</p>
        <p className="mt-2 text-slate-400">`NEXT_PUBLIC_API_URL`</p>
        <p className="mt-1 break-all text-slate-300">
          {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api"}
        </p>
      </div>
    </aside>
  );
}
