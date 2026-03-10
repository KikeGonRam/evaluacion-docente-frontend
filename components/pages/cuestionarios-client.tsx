"use client";

import { useMemo, useState } from "react";
import { CuestionarioForm } from "@/components/forms/cuestionario-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "@/components/ui/status-block";
import { DataTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { api, getErrorMessage } from "@/lib/api";
import type { CuestionarioDTO, CuestionarioRequestDTO } from "@/lib/types";
import { useResource } from "@/hooks/use-resource";
import { cn } from "@/lib/utils";

export function CuestionariosClient() {
  const cuestionarios = useResource(api.cuestionarios.getAll);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CuestionarioDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CuestionarioDTO | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  async function handleSubmit(values: CuestionarioRequestDTO) {
    setIsSaving(true);
    try {
      if (editing) {
        await api.cuestionarios.update(editing.id, values);
        setEditing(null);
        setFeedback({
          type: "success",
          message: "Instrumento actualizado correctamente.",
        });
      } else {
        await api.cuestionarios.create(values);
        setFeedback({
          type: "success",
          message: "Instrumento creado correctamente.",
        });
      }
      await cuestionarios.reload();
      setTimeout(() => setFeedback(null), 5000);
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
      await api.cuestionarios.remove(id);
      if (editing?.id === id) setEditing(null);
      await cuestionarios.reload();
      setFeedback({
        type: "success",
        message: "Instrumento eliminado correctamente.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }

  const filtered = useMemo(() => {
    const rows = cuestionarios.data ?? [];
    return rows.filter((item) =>
      `${item.titulo} ${item.preguntas.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [cuestionarios.data, query]);

  return (
    <div className="flex flex-col gap-10">
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Confirmar eliminación"
        description={`Se eliminará permanentemente el instrumento "${pendingDelete?.titulo ?? ""}". ¿Desea continuar?`}
        confirmLabel="Sí, eliminar instrumento"
        isProcessing={deletingId !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            void handleDelete(pendingDelete.id);
          }
        }}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cuestionarios Dinámicos</h1>
        <p className="text-slate-500 font-medium">Diseñe y mantenga los instrumentos de evaluación aplicados en la institución.</p>
      </div>

      {feedback ? (
        <div className={cn(
          "flex items-center gap-3 rounded-xl border p-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300",
          feedback.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
        )}>
          {feedback.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          )}
          <span className="text-sm font-bold">{feedback.message}</span>
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[450px_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <h3 className="mb-6 text-xl font-bold text-slate-800">
              {editing ? "Actualizar Instrumento" : "Configurar Nuevo"}
            </h3>
            <CuestionarioForm
              initialValue={editing}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditing(null)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-bold text-slate-800">Catálogo de Instrumentos</h3>
            <div className="relative w-full md:w-72">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por título..."
                className="pl-10"
              />
            </div>
          </div>

          {cuestionarios.isLoading ? <LoadingBlock label="Sincronizando instrumentos..." /> : null}
          
          {cuestionarios.error ? (
            <ErrorBlock message={cuestionarios.error} onRetry={() => void cuestionarios.reload()} />
          ) : null}

          {!cuestionarios.isLoading && !cuestionarios.error && !filtered.length ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">Sin resultados</p>
              <p className="mt-2 text-sm text-slate-400">No se han definido cuestionarios en el sistema.</p>
            </div>
          ) : null}

          {!cuestionarios.isLoading && !cuestionarios.error && filtered.length ? (
            <DataTable
              columns={[
                {
                  key: "titulo",
                  header: "Instrumento",
                  render: (row) => (
                    <div className="flex flex-col gap-2">
                      <p className="font-black text-slate-800">{row.titulo}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-utvt-blue/10 px-2 py-0.5 text-[10px] font-black uppercase text-utvt-blue">
                          {row.preguntas.length} preguntas
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">ID: #{row.id}</span>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "preguntas",
                  header: "Contenido del Instrumento",
                  render: (row) => (
                    <div className="flex flex-col gap-2 max-w-sm">
                      {row.preguntas.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-utvt-blue shadow-[0_0_8px_rgba(0,48,135,0.4)]"></div>
                          <p className="text-xs font-medium text-slate-600 line-clamp-1">{item}</p>
                        </div>
                      ))}
                      {row.preguntas.length > 3 && (
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-3.5">
                          + {row.preguntas.length - 3} preguntas adicionales
                        </p>
                      )}
                    </div>
                  ),
                },
                {
                  key: "acciones",
                  header: "Operaciones",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(row);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex h-10 items-center gap-2 rounded-xl border-2 border-utvt-blue/10 px-4 text-xs font-black uppercase tracking-widest text-utvt-blue transition-all duration-200 hover:bg-utvt-blue hover:text-white"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setPendingDelete(row)}
                        disabled={isSaving || deletingId !== null}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-all duration-200 hover:bg-rose-500 hover:text-white disabled:opacity-50"
                      >
                        {deletingId === row.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        )}
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={filtered}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
