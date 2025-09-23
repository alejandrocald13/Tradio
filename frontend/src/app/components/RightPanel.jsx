"use client";

import styles from "../purchases-sales/purchases-sales.module.css";

export default function RightPanel({ metrics }) {
  return (
    <aside className={styles.rightPanel}>
      <div className={styles.metrics}>
        {Object.entries(metrics).map(([label, value]) => (
          <div className={styles.metricRow} key={label}>
            <div>{label}</div>
            <div className={styles.metricValue}>{value}</div>
          </div>
        ))}
      </div>

      <div className={styles.circleChart}>
        <span>0.0</span>
      </div>
      <div className={styles.balanceLabel}>Balance General</div>
    </aside>
  );
}

