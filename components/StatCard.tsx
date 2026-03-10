import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export function StatCard({
  label,
  value,
  icon,
  borderColor,
  iconBgColor,
  iconColor,
  trend
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-[2.5rem] p-8 transition-all duration-500 glass-card shadow-utvt hover:-translate-y-2 overflow-hidden",
        borderColor
      )}
    >
      {/* Decorative educational element */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 transition-transform duration-700 group-hover:scale-150 group-hover:-rotate-12">
        {icon}
      </div>
      
      <div className={cn(
        "relative flex h-20 w-20 items-center justify-center rounded-3xl mb-6 group-hover:scale-110 transition-all duration-500 shadow-2xl ring-8 ring-white/50",
        iconBgColor,
        iconColor
      )}>
        {icon}
      </div>
      
      <div className="relative flex flex-col items-center">
        <span className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{value}</span>
        <span className="mt-3 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-utvt-green transition-colors text-center">
          {label}
        </span>
        
        {trend && (
          <div className={cn(
            "mt-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm",
            trend.isUp ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={cn(!trend.isUp && "rotate-180")}>
              <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
            </svg>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
