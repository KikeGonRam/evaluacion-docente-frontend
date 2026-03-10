"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type FeedbackType = "success" | "error" | null;

interface ActionFeedbackProps {
  type: FeedbackType;
  message: string;
  onClose: () => void;
}

export function ActionFeedback({ type, message, onClose }: ActionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500); // Wait for fade out animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-500 backdrop-blur-sm",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className={cn(
        "relative w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl border-4 transition-all duration-500",
        type === "success" 
          ? "bg-white border-utvt-green shadow-utvt animate-success" 
          : "bg-white border-rose-500 shadow-xl animate-shake",
        isVisible ? "scale-100" : "scale-90"
      )}>
        {/* Decoración Superior */}
        <div className={cn(
          "absolute -top-12 left-1/2 -translate-x-1/2 flex h-24 w-24 items-center justify-center rounded-[2.5rem] shadow-xl border-4 border-white",
          type === "success" ? "bg-utvt-green" : "bg-rose-500"
        )}>
          {type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <h4 className={cn(
            "text-2xl font-black uppercase tracking-tight",
            type === "success" ? "text-utvt-green" : "text-rose-600"
          )}>
            {type === "success" ? "¡Operación Exitosa!" : "Aviso del Sistema"}
          </h4>
          <p className="text-sm font-bold text-slate-500 leading-relaxed italic px-4">
            "{message}"
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className={cn(
            "mt-8 w-full rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95",
            type === "success" 
              ? "bg-utvt-bg text-utvt-green hover:bg-utvt-green hover:text-white" 
              : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
          )}
        >
          Entendido
        </button>

        {/* Mini Confetti para éxito */}
        {type === "success" && [1,2,3,4,5].map(i => (
          <div key={i} className="confetti" style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: i % 2 === 0 ? '#C9A84C' : '#00A85A'
          }}></div>
        ))}
      </div>
    </div>
  );
}
