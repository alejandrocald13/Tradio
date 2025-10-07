"use client";

import "../styles/DataTable.css";

export default function DataTable({ mode, data, columns, colKeys }) {
  // columnas por defecto
  const defaultColumns = {
    compras: ["Acción", "Compra", "# Acciones", "Fecha compra"],
    ventas: ["Acción", "Compra", "Venta", "%", "# Acciones", "Fecha venta"],
  };

  const defaultColKeys = {
    compras: ["accion", "compra", "cantidad", "fecha"],
    ventas: ["accion", "compra", "venta", "pct", "cantidad", "fecha"],
  };

  const cols = columns || defaultColumns[mode] || Object.keys(data[0] || {});
  const keys = colKeys || defaultColKeys[mode] || cols.map(c => c.toLowerCase());

  return (
    <div className="tableContainer">
      <div className="tableScroll" data-mode={mode}>
        <table className="table" data-mode={mode}>
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {keys.map((k, j) => (
                  <td key={j}>{row[k] !== undefined ? row[k] : ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
