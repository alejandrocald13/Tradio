"use client";

import styles from "../purchases-sales/purchases-sales.module.css";
import DoughnutGraph from "./DoughnutGraph"; 

export default function RightPanel({ metrics, graphData }) {
  return (
    <aside className={styles.rightPanel}>
      {/* Métricas arriba */}
      <div className={styles.metrics}>
        {Object.entries(metrics).map(([label, value]) => (
          <div className={styles.metricRow} key={label}>
            <div>{label}</div>
            <div className={styles.metricValue}>{value}</div>
          </div>
        ))}
      </div>
      
       <DoughnutGraph graphData={graphData} className={styles.graph} />


      {/* Etiqueta abajo */}
      <div className={styles.balanceLabel}>Balance General</div>
    </aside>
  );
}
