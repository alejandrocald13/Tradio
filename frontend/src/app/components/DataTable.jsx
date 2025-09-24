"use client";

import styles from "../purchases-sales/purchases-sales.module.css";

export default function DataTable({ tab, data }) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableScroll} data-mode={tab}>
        <table className={styles.table} data-mode={tab}>
          <thead>
            {tab === "compras" ? (
              <tr>
                <th>Acción</th>
                <th>Compra</th>
                <th># Acciones</th>
                <th>Fecha compra</th>
              </tr>
            ) : (
              <tr>
                <th>Acción</th>
                <th>Compra</th>
                <th>Venta</th>
                <th>%</th>
                <th># Acciones</th>
                <th>Fecha venta</th>
              </tr>
            )}
          </thead>

          <tbody>
            {data.map((r, i) =>
              tab === "compras" ? (
                <tr key={i}>
                  <td>{r.accion}</td>
                  <td>{r.compra}</td>
                  <td>{r.cantidad}</td>
                  <td>{r.fecha}</td>
                </tr>
              ) : (
                <tr key={i}>
                  <td>{r.accion}</td>
                  <td>{r.compra}</td>
                  <td>{r.venta}</td>
                  <td>{r.pct}</td>
                  <td>{r.cantidad}</td>
                  <td>{r.fecha}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
