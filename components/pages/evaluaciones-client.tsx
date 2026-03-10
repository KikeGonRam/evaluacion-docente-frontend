"use client";

import { useMemo, useState } from "react";
import { EvaluacionForm } from "@/components/forms/evaluacion-form";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "@/components/ui/status-block";
import { DataTable } from "@/components/ui/table";
import { api, getErrorMessage } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { formatDate, formatScore, cn } from "@/lib/utils";

import { ActionFeedback, type FeedbackType } from "@/components/ActionFeedback";

export function EvaluacionesClient() {
  const evaluaciones = useResource(api.evaluaciones.getAll);
  const docentes = useResource(api.docentes.getAll);
  const estudiantes = useResource(api.estudiantes.getAll);
  const cuestionarios = useResource(api.cuestionarios.getAll);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: FeedbackType;
    message: string;
  } | null>(null);

  async function handleSubmit(values: Parameters<typeof api.evaluaciones.create>[0]) {
    setIsSaving(true);
    try {
      await api.evaluaciones.create(values);
      await evaluaciones.reload();
      setFeedback({
        type: "success",
        message: "¡Excelente! La evaluación ha sido registrada en el expediente institucional.",
      });
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await api.evaluaciones.remove(id);
      await evaluaciones.reload();
      setFeedback({
        type: "success",
        message: "El registro ha sido eliminado correctamente de la base de datos.",
      });
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  }

  const isLoading =
    evaluaciones.isLoading ||
    docentes.isLoading ||
    estudiantes.isLoading ||
    cuestionarios.isLoading;

  const error =
    evaluaciones.error ||
    docentes.error ||
    estudiantes.error ||
    cuestionarios.error;

  const enriched = useMemo(() => {
    const docentesMap = new Map((docentes.data ?? []).map((item) => [item.id, item]));
    const estudiantesMap = new Map(
      (estudiantes.data ?? []).map((item) => [item.id, item]),
    );
    const cuestionariosMap = new Map(
      (cuestionarios.data ?? []).map((item) => [item.id, item]),
    );

    return (evaluaciones.data ?? [])
      .slice()
      .sort(
        (left, right) =>
          new Date(right.fechaEvaluacion).getTime() -
          new Date(left.fechaEvaluacion).getTime(),
      )
      .map((item) => ({
        ...item,
        docente: docentesMap.get(item.evaluadoId),
        estudiante: estudiantesMap.get(item.evaluadorId),
        cuestionario: cuestionariosMap.get(item.cuestionarioId),
      }));
  }, [cuestionarios.data, docentes.data, estudiantes.data, evaluaciones.data]);

  const getScoreBadgeClass = (score: number) => {
    if (score >= 4) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (score >= 3) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-rose-100 text-rose-700 border-rose-200";
  };

  return (
    <div className="flex flex-col gap-10">
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Confirmar eliminación"
        description={`Se eliminará permanentemente la evaluación #${pendingDeleteId ?? ""}. ¿Desea continuar?`}
        confirmLabel="Sí, eliminar registro"
        isProcessing={deletingId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId !== null) {
            void handleDelete(pendingDeleteId);
          }
        }}
      />
      
      <ActionFeedback 
        type={feedback?.type ?? null} 
        message={feedback?.message ?? ""} 
        onClose={() => setFeedback(null)} 
      />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Evaluaciones Académicas</h1>
        <p className="text-slate-500 font-medium">Gestione el historial de evaluaciones y registre nuevos instrumentos aplicados.</p>
      </div>

      {isLoading ? <LoadingBlock label="Cargando base de datos..." /> : null}
      
      {error ? (
        <ErrorBlock
          message={error}
          onRetry={() => {
            void evaluaciones.reload();
            void docentes.reload();
            void estudiantes.reload();
            void cuestionarios.reload();
          }}
        />
      ) : null}

      {!isLoading && !error ? (
        <div className="grid gap-12">
          <EvaluacionForm
            docentes={docentes.data ?? []}
            estudiantes={estudiantes.data ?? []}
            cuestionarios={cuestionarios.data ?? []}
            onSubmit={handleSubmit}
          />

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Historial de Aplicaciones</h3>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Actualizado</span>
              </div>
            </div>

            {enriched.length ? (
              <DataTable
                columns={[
                  {
                    key: "folio",
                    header: "Registro Académico",
                    render: (row) => (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className="font-black text-utvt-green text-base">#{row.id}</span>
                           <span className="bg-slate-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-md text-slate-500">Auditado</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {formatDate(row.fechaEvaluacion)}
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: "participantes",
                    header: "Entidades",
                    render: (row) => (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-utvt-green text-[11px] font-black text-white shadow-lg shadow-utvt-green/20">
                            {row.docente?.nombre.charAt(0) ?? "D"}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs font-black text-slate-800 leading-tight">{row.docente?.nombre ?? "Docente"}</p>
                            <p className="text-[9px] font-bold text-utvt-green uppercase tracking-tight">{row.docente?.materia ?? "Cátedra"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-utvt-gold text-[11px] font-black text-utvt-deep shadow-lg shadow-utvt-gold/20">
                            {row.estudiante?.nombre.charAt(0) ?? "E"}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs font-black text-slate-800 leading-tight">{row.estudiante?.nombre ?? "Alumno"}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Matrícula: {row.estudiante?.matricula ?? "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "detalle",
                    header: "Análisis & Feedback",
                    render: (row) => (
                      <div className="max-w-xs space-y-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-utvt-deep px-3 py-1.5 text-[9px] font-black uppercase text-utvt-gold border border-white/10 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                          {row.cuestionario?.titulo ?? `Instrumento #${row.cuestionarioId}`}
                        </span>
                        <p className="line-clamp-2 text-xs font-bold text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border-l-4 border-utvt-gold/30">
                          "{row.comentarioGeneral}"
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: "puntaje",
                    header: "Calidad Académica",
                    render: (row) => (
                      <div className="flex flex-col gap-2">
                        <div className={cn(
                          "inline-flex w-fit items-center justify-center rounded-xl border-2 px-4 py-2 text-xl font-black shadow-xl",
                          getScoreBadgeClass(row.puntajeFinal)
                        )}>
                          {formatScore(row.puntajeFinal)}
                        </div>
                        <div className="flex gap-1.5 px-1">
                          {row.respuestas.map((r, i) => (
                            <div key={i} className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              r >= 4 ? "bg-utvt-green" : r >= 3 ? "bg-utvt-gold" : "bg-rose-400"
                            )} title={`Reactivo ${i+1}: ${r}`}></div>
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "acciones",
                    header: "Operación",
                    render: (row) => (
                      <button
                        disabled={isSaving || deletingId !== null}
                        onClick={() => setPendingDeleteId(row.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-all duration-200 hover:bg-rose-500 hover:text-white active:scale-90 disabled:opacity-50"
                      >
                        {deletingId === row.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        )}
                      </button>
                    ),
                  },
                ]}
                rows={enriched}
              />
            ) : (
              <EmptyBlock
                title="Sin evaluaciones"
                description="Registra la primera evaluación para comenzar a construir métricas."
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
