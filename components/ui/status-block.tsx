import { cn } from "@/lib/utils";

export function LoadingBlock({ label = "Sincronizando..." }: { label?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 shadow-sm border border-slate-100">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-slate-100 border-t-utvt-green shadow-inner"></div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-utvt-green/5 text-utvt-green shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
        </div>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-utvt-green animate-pulse">{label}</p>
      </div>
      
      {/* Skeleton cards to improve perceived loading */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-white border border-slate-100"></div>
        ))}
      </div>
    </div>
  );
}

export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-3xl border-2 border-rose-50 bg-rose-50/20 p-10 shadow-utvt">
      <div className="flex items-start gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-500 shadow-sm ring-8 ring-rose-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-black text-rose-800 tracking-tight">Error de Sincronización</h4>
          <p className="max-w-md text-sm font-medium text-rose-600/70 leading-relaxed">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 w-fit rounded-xl bg-rose-600 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95"
            >
              Reintentar Operación
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/20 p-20 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white text-slate-200 shadow-sm border border-slate-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </div>
      <h4 className="text-xl font-black text-slate-800 uppercase tracking-widest">{title}</h4>
      <p className="mt-3 max-w-xs text-sm font-medium text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
