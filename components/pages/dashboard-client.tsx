"use client";

import { useMemo } from "react";
import { useResource } from "@/hooks/use-resource";
import { api } from "@/lib/api";
import { formatDate, formatScore } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "@/components/ui/status-block";
import { cn } from "@/lib/utils";

export function DashboardClient() {
  const evaluaciones = useResource(api.evaluaciones.getAll);
  const docentes = useResource(api.docentes.getAll);
  const cuestionarios = useResource(api.cuestionarios.getAll);

  const metrics = useMemo(() => {
    const evals = evaluaciones.data ?? [];
    const teachers = docentes.data ?? [];
    const forms = cuestionarios.data ?? [];
    const averageScore =
      evals.length > 0
        ? evals.reduce((sum, item) => sum + item.puntajeFinal, 0) / evals.length
        : 0;

    const byTeacher = teachers
      .map((teacher) => {
        const related = evals.filter((item) => item.evaluadoId === teacher.id);
        const score =
          related.length > 0
            ? related.reduce((sum, item) => sum + item.puntajeFinal, 0) / related.length
            : 0;

        return {
          id: teacher.id,
          nombre: teacher.nombre,
          materia: teacher.materia,
          total: related.length,
          score,
        };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 5);

    return {
      totalEvaluaciones: evals.length,
      totalDocentes: teachers.length,
      totalCuestionarios: forms.length,
      averageScore,
      byTeacher,
      recent: [...evals]
        .sort(
          (left, right) =>
            new Date(right.fechaEvaluacion).getTime() -
            new Date(left.fechaEvaluacion).getTime(),
        )
        .slice(0, 5),
    };
  }, [cuestionarios.data, docentes.data, evaluaciones.data]);

  const hasError = evaluaciones.error || docentes.error || cuestionarios.error;
  const isLoading =
    evaluaciones.isLoading || docentes.isLoading || cuestionarios.isLoading;

  const getScoreBadgeClass = (score: number) => {
    if (score >= 4.5) return "bg-utvt-gold text-utvt-deep border-utvt-gold font-black";
    if (score >= 4) return "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
    if (score >= 3) return "bg-slate-50 text-slate-600 border-slate-200 font-bold";
    return "bg-rose-50 text-rose-700 border-rose-100 font-bold";
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0: return (
        <div className="medal-gold flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-utvt-gold to-yellow-200 shadow-xl border-2 border-white text-utvt-deep">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
        </div>
      );
      case 1: return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-100 shadow-lg border-2 border-white text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
        </div>
      );
      case 2: return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-300 to-orange-100 shadow-lg border-2 border-white text-orange-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      );
      default: return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-xs font-black text-slate-400 border-2 border-white">
          #{index + 1}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Banner de Bienvenida Estilo Widget */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-utvt-dark p-12 shadow-2xl border border-white/5 fade-in-up">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-utvt-green opacity-20 blur-[100px]"></div>
        <div className="absolute -bottom-20 left-20 h-80 w-80 rounded-full bg-utvt-gold opacity-10 blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex h-fit w-fit items-center gap-2 rounded-full bg-white/5 px-5 py-2 border border-white/10 backdrop-blur-xl">
              <div className="h-2 w-2 rounded-full bg-utvt-gold animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-utvt-gold">Monitor Académico 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              Calidad <br/>
              <span className="text-utvt-gold italic">Educativa.</span>
            </h1>
            <p className="max-w-md text-sm md:text-lg font-medium text-white/60 leading-relaxed">
              Analizando el impacto pedagógico de nuestra facultad en tiempo real.
            </p>
          </div>
          
          <div className="relative lg:mr-10">
             <div className="flex flex-col items-center justify-center h-48 w-48 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-2xl shadow-2xl animate-float">
                <span className="text-7xl font-black text-utvt-gold tracking-tighter drop-shadow-2xl">{metrics.totalEvaluaciones}</span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-2">Registros</span>
             </div>
             {/* Decorative seal */}
             <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-utvt-green flex items-center justify-center text-white border-4 border-utvt-dark shadow-xl rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
             </div>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingBlock label="Sincronizando Inteligencia Académica..." /> : null}
      
      {!isLoading && !hasError ? (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 fade-in-up [animation-delay:200ms]">
            <StatCard
              label="Eficiencia"
              value={String(metrics.totalEvaluaciones)}
              borderColor="border-utvt-green"
              iconBgColor="bg-utvt-green/10"
              iconColor="text-utvt-green"
              trend={{ value: "+12%", isUp: true }}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              )}
            />
            <StatCard
              label="Facultad"
              value={String(metrics.totalDocentes)}
              borderColor="border-utvt-green-mid"
              iconBgColor="bg-utvt-green-mid/10"
              iconColor="text-utvt-green-mid"
              trend={{ value: "Total", isUp: true }}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              )}
            />
            <StatCard
              label="Instrumentos"
              value={String(metrics.totalCuestionarios)}
              borderColor="border-utvt-gold"
              iconBgColor="bg-utvt-gold/10"
              iconColor="text-utvt-gold"
              trend={{ value: "Activos", isUp: true }}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              )}
            />
            <StatCard
              label="Calificación"
              value={formatScore(metrics.averageScore)}
              borderColor="border-slate-800"
              iconBgColor="bg-slate-800/10"
              iconColor="text-slate-800"
              trend={{ value: "Promedio", isUp: false }}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
              )}
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] fade-in-up [animation-delay:400ms]">
            {/* Visual Analytics Widgets */}
            <div className="lg:col-span-2 grid gap-10 md:grid-cols-2">
               <div className="rounded-[3rem] bg-white p-12 shadow-utvt border border-white relative overflow-hidden group hover:shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Rendimiento Histórico</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Métrica comparativa mensual</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-utvt-green shadow-inner">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-56 gap-6 pt-10">
                    {[45, 78, 56, 92, 65, 88, 72].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                        <div className="w-full relative">
                           <div 
                            style={{ height: `${height}%` }} 
                            className={cn(
                              "w-full rounded-t-2xl transition-all duration-700 relative",
                              height > 80 ? "bg-utvt-gold" : "bg-slate-100 group-hover/bar:bg-utvt-green-light"
                            )}
                           >
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-utvt-deep text-white text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all shadow-2xl scale-50 group-hover/bar:scale-100">
                                {(height/20).toFixed(1)}
                              </div>
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 group-hover/bar:text-utvt-green">P-0{i+1}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="rounded-[3rem] bg-utvt-deep p-12 shadow-2xl border border-white/5 relative overflow-hidden flex flex-col items-center">
                  <div className="absolute -right-10 -top-10 w-72 h-72 bg-utvt-gold rounded-full blur-[120px] opacity-10"></div>
                  <div className="flex flex-col gap-2 mb-10 relative z-10 w-full">
                    <div className="flex items-center justify-center gap-3 mb-2">
                       <div className="h-px w-8 bg-utvt-gold/30"></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-utvt-gold">Excelencia UTVT</span>
                       <div className="h-px w-8 bg-utvt-gold/30"></div>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter text-center">Score Global</h3>
                  </div>
                  
                  <div className="relative flex items-center justify-center h-64 w-60">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 drop-shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                      <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="44" stroke="#C9A84C" strokeWidth="8" fill="none" strokeDasharray="276.4" strokeDashoffset={276.4 * (1 - metrics.averageScore / 5)} strokeLinecap="round" className="transition-all duration-[1.5s]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">{((metrics.averageScore / 5) * 100).toFixed(0)}%</span>
                      <span className="text-[10px] font-black text-utvt-green-light uppercase tracking-[0.3em] mt-2">Calidad Total</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Ranking Section with Medals */}
            <div className="rounded-[3.5rem] bg-white p-12 shadow-utvt border border-white">
              <div className="mb-12 flex items-center justify-between">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Cuadro de Honor</h3>
                <div className="bg-utvt-bg px-4 py-2 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-black uppercase tracking-widest text-utvt-green">Docentes</span>
                </div>
              </div>

              <div className="grid gap-12">
                {metrics.byTeacher.length ? (
                  metrics.byTeacher.map((teacher, index) => (
                    <div key={teacher.id} className="group flex items-center gap-8 relative">
                      <div className="shrink-0 relative">
                        {getMedalIcon(index)}
                      </div>
                      
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="font-black text-slate-800 tracking-tight text-xl leading-none">{teacher.nombre}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{teacher.materia}</p>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 rounded-2xl border-2 px-5 py-2.5 text-lg font-black shadow-sm transition-all group-hover:scale-110",
                            getScoreBadgeClass(teacher.score)
                          )}>
                            {formatScore(teacher.score)}
                          </div>
                        </div>
                        
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-50 p-0.5 border border-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              index === 0 ? "bg-utvt-gold" : "bg-utvt-green-mid"
                            )}
                            style={{
                              width: `${Math.max(5, Math.min((teacher.score / 5) * 100, 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyBlock
                    title="Sin datos de ranking"
                    description="Crea docentes y registra evaluaciones para ver métricas comparativas."
                  />
                )}
              </div>
            </div>

            {/* Recent Evaluations Section with Seals */}
            <div className="rounded-[3.5rem] bg-white p-12 shadow-utvt border border-white">
              <div className="mb-12">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Aplicaciones</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Últimos registros auditados</p>
              </div>
              
              <div className="relative space-y-12 before:absolute before:left-5 before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-slate-50">
                {metrics.recent.length ? (
                  metrics.recent.map((item) => (
                    <div
                      key={item.id}
                      className="relative pl-14"
                    >
                      <div className="absolute left-[14px] top-1.5 h-4 w-4 rounded-full border-[3px] border-white bg-utvt-gold ring-4 ring-utvt-gold/5 shadow-md"></div>
                      
                      <div className="rounded-[2.5rem] border border-slate-50 bg-slate-50/20 p-10 transition-all duration-500 hover:bg-white hover:shadow-2xl group/item relative overflow-hidden">
                        {item.puntajeFinal >= 4.5 && (
                          <div className="absolute -right-4 -top-4 h-24 w-24 bg-utvt-gold/10 rounded-full flex items-center justify-center text-utvt-gold rotate-12 group-hover/item:scale-125 transition-transform">
                             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-utvt-green leading-none">
                              {formatDate(item.fechaEvaluacion)}
                            </span>
                            <p className="text-xl font-black text-slate-800 tracking-tighter">Registro #{item.id}</p>
                          </div>
                          <div className={cn(
                            "rounded-2xl border-2 px-4 py-2 text-base font-black shadow-xl",
                            getScoreBadgeClass(item.puntajeFinal)
                          )}>
                            {formatScore(item.puntajeFinal)}
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-500 leading-relaxed italic border-l-4 border-utvt-gold/20 pl-6 py-2">
                          "{item.comentarioGeneral}"
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyBlock
                    title="Sin actividad"
                    description="Cuando se registren evaluaciones institucionales aparecerán en esta sección."
                  />
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
