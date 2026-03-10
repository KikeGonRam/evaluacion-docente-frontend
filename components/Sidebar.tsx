"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  )},
  { href: "/evaluaciones", label: "Evaluaciones", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  )},
  { href: "/docentes", label: "Docentes", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
  { href: "/cuestionarios", label: "Cuestionarios", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  )},
  { href: "/estudiantes", label: "Estudiantes", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  )},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[280px] flex-col bg-utvt-deep text-white lg:flex shadow-2xl z-50 border-r border-white/10">
      <div className="flex flex-col items-start px-8 py-12">
        <Logo />
      </div>

      <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 mt-4">
        <div className="space-y-3 py-4">
          <p className="px-5 pb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Navegación
          </p>
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-utvt-gold text-utvt-deep shadow-2xl shadow-utvt-gold/40"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className={cn(
                  "transition-colors duration-300",
                  isActive ? "text-utvt-deep" : "text-utvt-green-light"
                )}>
                  {link.icon}
                </div>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-8">
        <div className="rounded-[2rem] bg-white/5 p-6 text-center border border-white/10 backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-utvt-gold">
            UTVT SED
          </p>
          <p className="mt-1 text-[10px] font-bold text-white/40">
            Gestión de Calidad © 2026
          </p>
        </div>
      </div>
    </aside>
  );
}
