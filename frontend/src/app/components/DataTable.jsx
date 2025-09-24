"use client";

import styles from "../purchases-sales/purchases-sales.module.css";

export default function DataTable({ tab, data }) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        {tab === "compras" ? (
          <>
            <div>Accion</div>
            <div>Compra</div>
            <div># Acciones</div>
            <div>Fecha compra</div>
          </>
        ) : (
          <>
            <div>Accion</div>
            <div>Compra</div>
            <div>Venta</div>
            <div>%</div>
            <div># Acciones</div>
            <div>Fecha venta</div>
          </>
        )}
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
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

