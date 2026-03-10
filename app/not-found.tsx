import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-utvt-bg p-6 text-center">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-utvt-blue text-4xl font-black text-utvt-gold shadow-2xl shadow-utvt-blue/20">
          U
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-8xl font-black tracking-tighter text-utvt-blue/10">404</h1>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight -mt-10">Página no encontrada</h2>
          <p className="max-w-xs text-sm font-medium text-slate-500 leading-relaxed">
            El recurso que intenta consultar no existe o ha sido movido a otra ubicación institucional.
          </p>
        </div>

        <Link 
          href="/dashboard"
          className="mt-4 flex h-14 items-center justify-center gap-3 rounded-xl bg-utvt-blue px-10 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-utvt-blue/20 transition-all duration-300 hover:bg-utvt-dark hover:-translate-y-1 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Volver al Inicio
        </Link>
      </div>

      <div className="mt-20 border-t border-slate-200 pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          UTVT · Sistema de Evaluación Docente Académica
        </p>
      </div>
    </div>
  );
}
