"use client";

import { useState } from "react";
import styles from "./purchases-sales.module.css";
import { ArrowLeft } from "lucide-react";

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
          <ArrowLeft 
            size={28} 
            className={styles.backArrow} 
            onClick={() => console.log("Volver")} 
          />
          <h1 className={styles.title}>{tab === "compras" ? "Compras" : "Ventas"}</h1>
          <div style={{ width: 28 }} /> {/* espacio para centrar el título */}
        </div>
        <div className={styles.contenedorFiltro}>

            <div className={styles.dateFilter}>
              <label className={styles.dateLabel}>Desde:</label>
              <input type="date" className={styles.dateInput} />

              <label className={styles.dateLabel}>Hasta:</label>
              <input type="date" className={styles.dateInput} />
              <button>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"></path><path d="M11.412,8.586C11.791,8.966,12,9.468,12,10h2c0-1.065-0.416-2.069-1.174-2.828c-1.514-1.512-4.139-1.512-5.652,0 l1.412,1.416C9.346,7.83,10.656,7.832,11.412,8.586z"></path></svg>
              </button>
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