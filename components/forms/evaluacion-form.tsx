"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Select, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/api";
import { average, cn } from "@/lib/utils";
import type {
  CuestionarioDTO,
  DocenteDTO,
  EstudianteDTO,
  EvaluacionRequestDTO,
} from "@/lib/types";

export function EvaluacionForm({
  docentes,
  estudiantes,
  cuestionarios,
  onSubmit,
}: {
  docentes: DocenteDTO[];
  estudiantes: EstudianteDTO[];
  cuestionarios: CuestionarioDTO[];
  onSubmit: (values: EvaluacionRequestDTO) => Promise<void>;
}) {
  const [values, setValues] = useState({
    evaluadorId: "",
    evaluadoId: "",
    cuestionarioId: "",
    comentarioGeneral: "",
  });
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cuestionarioActivo = useMemo(
    () =>
      cuestionarios.find(
        (cuestionario) => cuestionario.id === Number(values.cuestionarioId),
      ),
    [cuestionarios, values.cuestionarioId],
  );

  function handleQuestionnaireChange(nextValue: string) {
    const selected = cuestionarios.find(
      (cuestionario) => cuestionario.id === Number(nextValue),
    );

    setValues((current) => ({ ...current, cuestionarioId: nextValue }));
    setRespuestas(selected ? new Array(selected.preguntas.length).fill(3) : []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.evaluadorId || !values.evaluadoId || !values.cuestionarioId) {
      setError("Debes seleccionar estudiante, docente y cuestionario.");
      return;
    }

    if (respuestas.length < 3 || respuestas.some((item) => item < 1 || item > 5)) {
      setError("La evaluación requiere al menos 3 respuestas entre 1 y 5.");
      return;
    }

    if (!values.comentarioGeneral.trim()) {
      setError("El comentario general es obligatorio.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        evaluadorId: Number(values.evaluadorId),
        evaluadoId: Number(values.evaluadoId),
        cuestionarioId: Number(values.cuestionarioId),
        respuestas,
        comentarioGeneral: values.comentarioGeneral.trim(),
      });
      setValues({
        evaluadorId: "",
        evaluadoId: "",
        cuestionarioId: "",
        comentarioGeneral: "",
      });
      setRespuestas([]);
    } catch (caughtError) {
      setSubmitError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  const getRatingInfo = (score: number) => {
    switch (score) {
      case 1: return { 
        color: "bg-rose-500 text-white border-rose-600", 
        label: "Deficiente", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        ) 
      };
      case 2: return { 
        color: "bg-orange-400 text-white border-orange-500", 
        label: "Regular", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/></svg>
        ) 
      };
      case 3: return { 
        color: "bg-utvt-gold text-utvt-dark border-utvt-gold", 
        label: "Bueno", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>
        ) 
      };
      case 4: return { 
        color: "bg-utvt-green-light text-white border-utvt-green-light", 
        label: "Muy Bueno", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        ) 
      };
      case 5: return { 
        color: "bg-utvt-green text-white border-utvt-green", 
        label: "Excelente", 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        ) 
      };
      default: return { color: "bg-white text-slate-300 border-slate-100", label: "", icon: null };
    }
  };

  return (
    <div className="rounded-[3rem] bg-white p-12 shadow-utvt border border-white mb-12 transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
         <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
           <div className="h-1.5 w-10 rounded-full bg-utvt-gold"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-utvt-green">Formulario Institucional</span>
        </div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Evaluación del Desempeño</h3>
        <p className="mt-4 text-sm font-medium text-slate-400 max-w-xl leading-relaxed">Su participación es fundamental para la mejora continua. Por favor, califique los siguientes criterios con honestidad.</p>
      </div>

      <form className="grid gap-12" onSubmit={handleSubmit}>
        {submitError ? <Alert message={submitError} variant="error" /> : null}
        
        <div className="grid gap-8 md:grid-cols-3">
          <FormField label="Estudiante Evaluador">
            <Select
              value={values.evaluadorId}
              onChange={(event) =>
                setValues((current) => ({ ...current, evaluadorId: event.target.value }))
              }
              className="rounded-2xl"
            >
              <option value="">Seleccionar Estudiante</option>
              {estudiantes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre} · {item.matricula}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Docente a Evaluar">
            <Select
              value={values.evaluadoId}
              onChange={(event) =>
                setValues((current) => ({ ...current, evaluadoId: event.target.value }))
              }
              className="rounded-2xl"
            >
              <option value="">Seleccionar Catedrático</option>
              {docentes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre} · {item.materia}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Selección de Instrumento">
            <Select
              value={values.cuestionarioId}
              onChange={(event) => handleQuestionnaireChange(event.target.value)}
              className="rounded-2xl"
            >
              <option value="">Seleccionar Cuestionario</option>
              {cuestionarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.titulo}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        {cuestionarioActivo ? (
          <div className="grid gap-10 rounded-4xl bg-slate-50/50 p-10 border border-slate-100">
            <div className="flex items-center justify-between px-2">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Preguntas del Instrumento</p>
               <span className="text-[10px] font-black text-utvt-gold bg-utvt-gold/10 px-3 py-1 rounded-full">{respuestas.length} Reactivos</span>
            </div>
            {cuestionarioActivo.preguntas.map((pregunta, index) => (
              <div key={`${cuestionarioActivo.id}-${index}`} className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm border border-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <p className="text-base font-black text-slate-700 leading-tight">
                  <span className="text-utvt-gold mr-2">Q{index + 1}.</span> {pregunta}
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const info = getRatingInfo(score);
                    const isSelected = respuestas[index] === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() =>
                          setRespuestas((current) =>
                            current.map((item, currentIndex) =>
                              currentIndex === index ? score : item,
                            ),
                          )
                        }
                        className={cn(
                          "flex flex-col items-center gap-3 rounded-2xl py-5 border-2 transition-all duration-300 group/btn",
                          isSelected
                            ? info.color + " shadow-lg shadow-current/20 scale-105"
                            : "bg-slate-50/50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200"
                        )}
                      >
                        <div className={cn("transition-transform duration-300", isSelected ? "scale-110" : "scale-100 opacity-40 group-hover/btn:opacity-100")}>
                          {info.icon}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-4xl border-2 border-dashed border-slate-100 bg-slate-50/30 p-20 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white text-slate-200 shadow-sm border border-slate-50 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </div>
            <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">¿Listo para comenzar?</h4>
            <p className="mt-2 text-sm font-medium text-slate-300">Selecciona un instrumento arriba para cargar las preguntas.</p>
          </div>
        )}

        <div className="grid gap-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Comentario Adicional</p>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{values.comentarioGeneral.length} / 500</span>
          </div>
          <Textarea
            value={values.comentarioGeneral}
            maxLength={500}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                comentarioGeneral: event.target.value,
              }))
            }
            placeholder="¿Algo más que desees agregar sobre el desempeño de este catedrático?"
            className="rounded-[2rem] p-8 border-slate-100 focus:bg-slate-50/50"
          />
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between rounded-[3rem] bg-gradient-to-br from-utvt-dark to-utvt-green p-12 border border-white/5 shadow-2xl relative overflow-hidden group/footer">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex items-center gap-10">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-utvt-gold">Promedio de Sesión</p>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black text-white tracking-tighter leading-none">
                  {average(respuestas).toFixed(2)}
                </span>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-utvt-green-light uppercase tracking-widest">Score UTVT</span>
                   <div className="h-1 w-full bg-white/10 rounded-full mt-1">
                      <div className="h-full bg-utvt-green-light rounded-full" style={{ width: `${(average(respuestas)/5)*100}%` }}></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
             {error ? (
              <p className="text-xs font-black text-utvt-gold uppercase tracking-widest animate-pulse border-b border-utvt-gold/20 pb-1">{error}</p>
            ) : null}
            <button 
              disabled={isSubmitting} 
              type="submit"
              className="flex h-20 items-center justify-center gap-4 rounded-3xl bg-utvt-gold px-12 text-[12px] font-black uppercase tracking-[0.3em] text-utvt-dark shadow-2xl shadow-utvt-gold/30 transition-all duration-500 hover:scale-105 hover:bg-white active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-utvt-dark border-t-transparent"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              )}
              {isSubmitting ? "Sincronizando..." : "Registrar Ahora"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
