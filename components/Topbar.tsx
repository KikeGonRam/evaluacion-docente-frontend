"use client";

import { usePathname } from "next/navigation";

export function Topbar() {
  const pathname = usePathname();
  const pageName = pathname.split("/").pop() || "Dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  const currentDate = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/60 bg-white/60 px-8 backdrop-blur-xl">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>Control Académico</span>
          <span className="text-utvt-gold">/</span>
          <span className="text-utvt-green">{formattedPageName}</span>
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-1">
          {formattedPageName === "Dashboard" ? "Panel de Análisis" : formattedPageName}
        </h2>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden flex-col items-end md:flex">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Fecha de hoy</span>
          <span className="text-xs font-bold text-slate-600 capitalize">{currentDate}</span>
        </div>
        
        <div className="h-10 w-px bg-slate-100"></div>

        <div className="flex items-center gap-4">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-black text-slate-800 tracking-tight leading-none">Administrador</span>
            <span className="mt-1 text-[9px] font-black uppercase tracking-widest text-utvt-gold bg-utvt-deep px-2 py-0.5 rounded-md">
              Sede Central
            </span>
          </div>
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-utvt-dark to-utvt-green text-sm font-black text-white shadow-xl shadow-utvt-green/20">
              AD
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
