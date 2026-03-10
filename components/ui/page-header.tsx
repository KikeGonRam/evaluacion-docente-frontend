import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
      </div>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}
