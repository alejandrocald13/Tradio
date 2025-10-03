"use client";

import { useState } from "react";
import styles from "./purchases-sales.module.css";

// Importar los componentes
import Sidebar from "../components/Sidebar";
import DataTable from "../components/DataTable";
import RightPanel from "../components/RightPanel";
import ModalForm from "../components/ModalForm";

export default function ComprasVentasPage() {
  const [tab, setTab] = useState("compras"); // "compras" | "ventas"
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    accion: "",
    compra: "",
    venta: "",
    cantidad: "",
    fecha: "",
  });

  const ventas = [
    { accion: "Tesla", compra: "$100", venta: "$110", pct: "+10%", cantidad: "5", fecha: "04/09/2025" },
    { accion: "Tesla", compra: "$100", venta: "$110", pct: "+10%", cantidad: "5", fecha: "04/09/2025" },
    { accion: "Tesla", compra: "$100", venta: "$110", pct: "+10%", cantidad: "5", fecha: "04/09/2025" },
    { accion: "Tesla", compra: "$100", venta: "$110", pct: "+10%", cantidad: "5", fecha: "04/09/2025" },
    { accion: "Tesla", compra: "$100", venta: "$110", pct: "+10%", cantidad: "5", fecha: "04/09/2025" },
    { accion: "Tesla", compra: "$100", venta: "$110", pct: "+10%", cantidad: "5", fecha: "04/09/2025" },
  ];

  const compras = [
    { accion: "Tesla", compra: "$100", cantidad: "5", fecha: "01/09/2025" },
    { accion: "Tesla", compra: "$100", cantidad: "5", fecha: "01/09/2025" },
    { accion: "Tesla", compra: "$100", cantidad: "5", fecha: "01/09/2025" },
    { accion: "Tesla", compra: "$100", cantidad: "5", fecha: "01/09/2025" },
    { accion: "Tesla", compra: "$100", cantidad: "5", fecha: "01/09/2025" },
    { accion: "Tesla", compra: "$100", cantidad: "5", fecha: "01/09/2025" },
  ];

  const metrics = {
    Ganancias: "$100",
    Perdidas: "$100",
    "Total vendido": "$100",
    "Total comprado": "$100",
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setForm({ accion: "", compra: "", venta: "", cantidad: "", fecha: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${tab === "compras" ? "Compra" : "Venta"} agregada:\n` + JSON.stringify(form, null, 2));
    closeModal();
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <Sidebar activeTab={tab} setTab={setTab} />

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>{tab === "compras" ? "Compras" : "Ventas"}</h1>

          <div className={styles.headerControls}>
            <div className={styles.dateFilter}>
              <label className={styles.dateLabel}>Desde:</label>
              <input type="date" className={styles.dateInput} />

              <label className={styles.dateLabel}>Hasta:</label>
              <input type="date" className={styles.dateInput} />
            </div>


            <div className={styles.switcher}>
              <button
                className={`${styles.switchBtn} ${tab === "compras" ? styles.switchActive : ""}`}
                onClick={() => setTab("compras")}
              >
                Compras
              </button>
              <button
                className={`${styles.switchBtn} ${tab === "ventas" ? styles.switchActive : ""}`}
                onClick={() => setTab("ventas")}
              >
                Ventas
              </button>
            </div>

           
          </div>
        </div>

        {/* Tabla de datos */}
        <DataTable tab={tab} data={tab === "compras" ? compras : ventas} />
      </main>

      {/* Panel derecho */}
      <RightPanel metrics={metrics} />

      {/* Modal */}
      {modalOpen && (
        <ModalForm
          tab={tab}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}