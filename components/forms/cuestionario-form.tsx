"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/api";
import type { CuestionarioDTO, CuestionarioRequestDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

function normalizePreguntas(values: string[]) {
  return values.map((item) => item.trim()).filter(Boolean);
}

export function CuestionarioForm({
  initialValue,
  onSubmit,
  onCancelEdit,
}: {
  initialValue?: CuestionarioDTO | null;
  onSubmit: (values: CuestionarioRequestDTO) => Promise<void>;
  onCancelEdit?: () => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [preguntas, setPreguntas] = useState<string[]>(["", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitulo(initialValue?.titulo ?? "");
    setPreguntas(initialValue?.preguntas ?? ["", "", ""]);
  }, [initialValue]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = normalizePreguntas(preguntas);

    if (!titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (cleaned.length < 3) {
      setError("Debes registrar al menos 3 preguntas.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({ titulo: titulo.trim(), preguntas: cleaned });
      if (!initialValue) {
        setTitulo("");
        setPreguntas(["", "", ""]);
      }
    } catch (caughtError) {
      setSubmitError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <form className="grid gap-6" onSubmit={handleSubmit}>
        {submitError ? <Alert message={submitError} variant="error" /> : null}
        
        <FormField label="Título del Instrumento" error={error && !titulo.trim() ? error : undefined}>
          <Input
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ej. Evaluación de Desempeño Docente 2026"
            className="font-bold text-slate-800"
          />
        </FormField>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Preguntas Dinámicas</p>
            <span className="text-[10px] font-bold text-utvt-blue bg-utvt-blue/5 px-2 py-0.5 rounded-full">Min. 3 requeridas</span>
          </div>
          
          <div className="grid gap-3">
            {preguntas.map((pregunta, index) => (
              <div key={index} className="group relative flex items-center gap-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xs font-black text-slate-400 border border-slate-100 group-focus-within:bg-utvt-blue group-focus-within:text-white group-focus-within:border-utvt-blue transition-all duration-200">
                  {index + 1}
                </div>
                <Input
                  value={pregunta}
                  onChange={(event) =>
                    setPreguntas((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index ? event.target.value : item,
                      ),
                    )
                  }
                  placeholder={`Escribe la pregunta #${index + 1}...`}
                  className="flex-1"
                />
                {preguntas.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setPreguntas((current) => current.filter((_, i) => i !== index))}
                    className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition-all hover:scale-110 group-hover:flex"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => setPreguntas((current) => [...current, ""])}
            className="flex items-center gap-2 rounded-xl bg-utvt-gold/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-utvt-blue transition-all duration-200 hover:bg-utvt-gold/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-utvt-gold"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Agregar Pregunta
          </button>
          
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <button 
            disabled={isSubmitting} 
            type="submit"
            className="flex-1 h-12 rounded-xl bg-utvt-blue px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-utvt-blue/20 transition-all duration-300 hover:bg-utvt-dark active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Procesando..." : initialValue ? "Actualizar Instrumento" : "Crear Instrumento"}
          </button>
          {initialValue && onCancelEdit ? (
            <button 
              type="button" 
              onClick={onCancelEdit}
              className="px-6 h-12 rounded-xl border-2 border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all duration-200"
            >
              Cancelar
            </button>
          ) : null}
        </div>
        {error && <p className="text-center text-xs font-bold text-rose-500">{error}</p>}
      </form>
    </div>
  );
}
