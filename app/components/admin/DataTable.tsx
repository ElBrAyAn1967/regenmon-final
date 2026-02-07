// ==============================================
// DATA TABLE (NES.css)
// ==============================================
// Tabla de datos con estilo pixel art

"use client";

import { ReactNode } from "react";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="nes-table is-bordered is-dark" style={{ width: "100%", fontSize: "0.7rem" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} style={{ padding: "1rem" }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <td key={col.accessor} style={{ padding: "1rem" }}>
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
