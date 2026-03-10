"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/api";
import type { DocenteDTO, DocenteRequestDTO } from "@/lib/types";

interface Props {
  initialValue?: DocenteDTO | null;
  onSubmit: (values: DocenteRequestDTO) => Promise<void>;
  onCancelEdit?: () => void;
}

export function DocenteForm({ initialValue, onSubmit, onCancelEdit }: Props) {
  const [values, setValues] = useState<DocenteRequestDTO>({
    nombre: "",
    materia: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DocenteRequestDTO, string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      nombre: initialValue?.nombre ?? "",
      materia: initialValue?.materia ?? "",
      email: initialValue?.email ?? "",
    });
  }, [initialValue]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof DocenteRequestDTO, string>> = {};

    if (!values.nombre.trim()) nextErrors.nombre = "El nombre es obligatorio.";
    if (!values.materia.trim()) nextErrors.materia = "La materia es obligatoria.";
    if (!/\S+@\S+\.\S+/.test(values.email)) nextErrors.email = "Ingresa un email válido.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        nombre: values.nombre.trim(),
        materia: values.materia.trim(),
        email: values.email.trim(),
      });
      if (!initialValue) {
        setValues({ nombre: "", materia: "", email: "" });
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
            placeholder="Nombre del docente"
          />
        </FormField>

        <FormField label="Materia" error={errors.materia}>
          <Input
            value={values.materia}
            onChange={(event) =>
              setValues((current) => ({ ...current, materia: event.target.value }))
            }
            placeholder="Ej. Matemáticas"
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
