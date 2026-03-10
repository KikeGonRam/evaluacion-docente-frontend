import { DocenteDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DocenteCardProps {
  docente: DocenteDTO;
  onEdit: (docente: DocenteDTO) => void;
  onDelete: (docente: DocenteDTO) => void;
  isDeleting?: boolean;
}

const AVATAR_COLORS = [
  "bg-utvt-green text-white",
  "bg-utvt-green-mid text-white",
  "bg-utvt-gold text-utvt-deep",
  "bg-slate-700 text-white",
];

export function DocenteCard({ docente, onEdit, onDelete, isDeleting }: DocenteCardProps) {
  const colorIndex = docente.id % AVATAR_COLORS.length;
  const avatarColor = AVATAR_COLORS[colorIndex];

  return (
    <div className="group flex flex-col rounded-[2rem] bg-white p-8 shadow-utvt border border-slate-50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-center gap-5">
        <div className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black shadow-inner transition-transform duration-500 group-hover:rotate-6",
          avatarColor
        )}>
          {docente.nombre.charAt(0)}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <h4 className="truncate text-lg font-black text-slate-800 tracking-tight leading-none">{docente.nombre}</h4>
          <p className="truncate text-xs font-bold text-slate-500 mt-1">{docente.email}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-utvt-green"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate">{docente.materia}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => onEdit(docente)}
          className="flex-1 rounded-xl border-2 border-utvt-green px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-utvt-green transition-all duration-300 hover:bg-utvt-green hover:text-white"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(docente)}
          disabled={isDeleting}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 transition-all duration-300 hover:bg-rose-600 hover:text-white disabled:opacity-50 shadow-sm"
        >
          {isDeleting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}
