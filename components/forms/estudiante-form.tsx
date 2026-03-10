"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/api";
import type { EstudianteDTO, EstudianteRequestDTO } from "@/lib/types";

export function EstudianteForm({
  initialValue,
  onSubmit,
  onCancelEdit,
}: {
  initialValue?: EstudianteDTO | null;
  onSubmit: (values: EstudianteRequestDTO) => Promise<void>;
  onCancelEdit?: () => void;
}) {
  const [values, setValues] = useState<EstudianteRequestDTO>({
    nombre: "",
    matricula: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EstudianteRequestDTO, string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      nombre: initialValue?.nombre ?? "",
      matricula: initialValue?.matricula ?? "",
      email: initialValue?.email ?? "",
    });
  }, [initialValue]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof EstudianteRequestDTO, string>> = {};

    if (!values.nombre.trim()) nextErrors.nombre = "El nombre es obligatorio.";
    if (!values.matricula.trim()) nextErrors.matricula = "La matrícula es obligatoria.";
    if (!/\S+@\S+\.\S+/.test(values.email)) nextErrors.email = "Ingresa un email válido.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        nombre: values.nombre.trim(),
        matricula: values.matricula.trim(),
        email: values.email.trim(),
      });
      if (!initialValue) {
        setValues({ nombre: "", matricula: "", email: "" });
      }
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {submitError ? <Alert message={submitError} /> : null}
        <FormField label="Nombre" error={errors.nombre}>
          <Input
            value={values.nombre}
            onChange={(event) =>
              setValues((current) => ({ ...current, nombre: event.target.value }))
            }
            placeholder="Nombre del estudiante"
          />
        </FormField>

        <FormField label="Matrícula" error={errors.matricula}>
          <Input
            value={values.matricula}
            onChange={(event) =>
              setValues((current) => ({ ...current, matricula: event.target.value }))
            }
            placeholder="Ej. 202400123"
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="correo@ejemplo.com"
          />
        </FormField>

        <div className="flex gap-3">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Guardando..." : initialValue ? "Actualizar" : "Crear"}
          </Button>
          {initialValue && onCancelEdit ? (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
