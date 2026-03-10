import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
}: {
  columns: TableColumn<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-utvt-bg/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {rows.map((row, index) => (
              <tr key={index} className="align-top transition-all duration-300 hover:bg-utvt-bg/30 even:bg-utvt-bg/10">
                {columns.map((column) => (
                  <td key={column.key} className="px-8 py-6 text-sm font-bold text-slate-600 tracking-tight">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
