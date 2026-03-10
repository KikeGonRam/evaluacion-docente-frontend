export function Logo() {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]">
        <div className="absolute inset-0 rounded-full bg-utvt-green-light opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
        <svg viewBox="0 0 60 60" className="h-full w-full relative z-10 drop-shadow-xl">
          <defs>
            <linearGradient id="utvt-grad-new" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A85A" />
              <stop offset="100%" stopColor="#006B3F" />
            </linearGradient>
          </defs>
          <circle cx="30" cy="30" r="28" fill="url(#utvt-grad-new)" stroke="#C9A84C" strokeWidth="1"/>
          {/* Curva característica UTVT con efecto de luz */}
          <path d="M 12 35 Q 30 12 48 35" 
                stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" className="drop-shadow-sm"/>
          <path d="M 16 42 Q 30 22 44 42" 
                stroke="#C9A84C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-black tracking-tighter text-white leading-none">
          UTVT<span className="text-utvt-gold">.</span>
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="h-1 w-1 rounded-full bg-utvt-green-light animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-utvt-green-light transition-colors">
            Portal Académico
          </span>
        </div>
      </div>
    </div>
  );
}
