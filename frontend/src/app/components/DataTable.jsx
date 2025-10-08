"use client";

import "../styles/DataTable.css";

export default function DataTable({ mode, data = [], columns = [] }) {
  if (!data.length && !columns.length) {
    return <p>No hay datos para mostrar</p>;
  }

  // Si no se pasan columnas, usamos las keys del primer objeto
  const cols = columns.length
    ? columns
    : Object.keys(data[0]).map((k) => ({ key: k, label: k }));

  return (
    <div className="tableContainer">
      <div className="tableScroll" data-mode={mode}>
        <table className="table" data-mode={mode}>
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={i}>{c.label || c.key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {cols.map((c, j) => (
                  <td key={j}>{row[c.key] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
