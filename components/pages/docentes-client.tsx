"use client";

import { useMemo, useState } from "react";
import { DocenteForm } from "@/components/forms/docente-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "@/components/ui/status-block";
import { Input } from "@/components/ui/input";
import { DocenteCard } from "@/components/DocenteCard";
import { api, getErrorMessage } from "@/lib/api";
import type { DocenteDTO, DocenteRequestDTO } from "@/lib/types";
import { useResource } from "@/hooks/use-resource";
import { cn } from "@/lib/utils";

import { ActionFeedback, type FeedbackType } from "@/components/ActionFeedback";

export function DocentesClient() {
  const docentes = useResource(api.docentes.getAll);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<DocenteDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DocenteDTO | null>(null);
  const [feedback, setFeedback] = useState<{
    type: FeedbackType;
    message: string;
  } | null>(null);

  async function handleSubmit(values: DocenteRequestDTO) {
    setIsSaving(true);
    try {
      if (editing) {
        await api.docentes.update(editing.id, values);
        setEditing(null);
        setFeedback({ 
          type: "success", 
          message: "Los datos del catedrático han sido actualizados exitosamente en el sistema." 
        });
      } else {
        await api.docentes.create(values);
        setFeedback({ 
          type: "success", 
          message: "¡Nuevo docente registrado! Se ha integrado correctamente al catálogo institucional." 
        });
      }
      await docentes.reload();
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
      await api.docentes.remove(id);
      if (editing?.id === id) setEditing(null);
      await docentes.reload();
      setFeedback({ 
        type: "success", 
        message: "El registro del docente ha sido removido de forma segura de la base de datos." 
      });
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }

  const filtered = useMemo(() => {
    const rows = docentes.data ?? [];
    return rows.filter((item) =>
      `${item.nombre} ${item.email} ${item.materia}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [docentes.data, query]);

  return (
    <div className="flex flex-col gap-10">
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Confirmar eliminación"
        description={`Se eliminará permanentemente a ${pendingDelete?.nombre ?? "este docente"}. ¿Desea continuar?`}
        confirmLabel="Sí, eliminar docente"
        isProcessing={deletingId !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            void handleDelete(pendingDelete.id);
          }
        }}
      />

      <ActionFeedback 
        type={feedback?.type ?? null} 
        message={feedback?.message ?? ""} 
        onClose={() => setFeedback(null)} 
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestión de Docentes</h1>
        <p className="text-slate-500 font-medium">Administre el catálogo institucional de catedráticos y sus materias asignadas.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <h3 className="mb-6 text-xl font-bold text-slate-800">
              {editing ? "Actualizar Registro" : "Nuevo Registro"}
            </h3>
            <DocenteForm
              initialValue={editing}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditing(null)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-bold text-slate-800">Catedráticos Registrados</h3>
            <div className="relative w-full md:w-72">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar catedrático..."
                className="pl-10"
              />
            </div>
          </div>

          {docentes.isLoading ? <LoadingBlock label="Sincronizando registros..." /> : null}
          
          {docentes.error ? (
            <ErrorBlock message={docentes.error} onRetry={() => void docentes.reload()} />
          ) : null}

          {!docentes.isLoading && !docentes.error && !filtered.length ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">Sin resultados</p>
              <p className="mt-2 text-sm text-slate-400 max-w-xs">No se encontraron docentes que coincidan con su búsqueda o la base de datos está vacía.</p>
            </div>
          ) : null}

          {!docentes.isLoading && !docentes.error && filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <DocenteCard
                  key={item.id}
                  docente={item}
                  onEdit={(row) => {
                    setEditing(row);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onDelete={setPendingDelete}
                  isDeleting={deletingId === item.id}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
