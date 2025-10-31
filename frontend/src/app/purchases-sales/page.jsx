"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./purchases-sales.module.css";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import DataTable from "../components/DataTable";
import RightPanel from "../components/RightPanel";
import ModalForm from "../components/ModalForm";
import SidebarNavAuth from "../components/SidebarNav-Auth";
import { api } from "../lib/axios";

export default function ComprasVentasPage() {
  const [tab, setTab] = useState("compras"); 
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    accion: "",
    compra: "",
    venta: "",
    cantidad: "",
    fecha: "",
  });

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [comprasData, setComprasData] = useState([]);
  const [ventasData, setVentasData] = useState([]);

  const router = useRouter();

  function parseMoney(str) {
    if (!str) return 0;
    const clean = String(str).replace(/[^0-9.\-]/g, "");
    const n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }

  function parseQty(str) {
    const n = parseFloat(str);
    return isNaN(n) ? 0 : n;
  }

  
  const { metrics, graphData } = useMemo(() => {
    const totalComprado = comprasData.reduce((acc, row) => {
      const precioCompra = parseMoney(row.compra); 
      const qty = parseQty(row.cantidad); 
      return acc + precioCompra * qty;
    }, 0);

    const totalVendido = ventasData.reduce((acc, row) => {
      const precioVenta = parseMoney(row.venta);
      const qty = parseQty(row.cantidad);
      return acc + precioVenta * qty;
    }, 0);

    const balanceGeneral = totalVendido - totalComprado;

    return {
      metrics: {
        "Total sales": `$${totalVendido.toFixed(2)}`,
        "Total purchases": `$${totalComprado.toFixed(2)}`,
        "Overall Balance": `$${balanceGeneral.toFixed(2)}`,
      },
      graphData: {
        clasificacion: ["Purchase", "Sale"],
        name: "Purchases/Sales",
        dataL: [totalComprado, totalVendido],
        widthSend: 200,
        heightSend: 200,
        num: 2,
      },
    };
  }, [comprasData, ventasData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        const comprasRes = await api.get("/transactions/me/purchases/", {
          params,
        });
        setComprasData(comprasRes.data || []);

        const ventasRes = await api.get("/transactions/me/sales/", {
          params,
        });
        setVentasData(ventasRes.data || []);
      } catch (err) {
        console.log("Error obteniendo historial usuario", err);
        setComprasData([]);
        setVentasData([]);
      }
    };

    fetchData();
  }, [dateFrom, dateTo]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setForm({
      accion: "",
      compra: "",
      venta: "",
      cantidad: "",
      fecha: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `${tab === "compras" ? "Compra" : "Venta"} agregada:\n` +
        JSON.stringify(form, null, 2)
    );
    closeModal();
  };

  const currentData = tab === "compras" ? comprasData : ventasData;

  const columnsCompras = [
    { key: "accion", label: "Action" },
    { key: "compra", label: "Purchase" },
    { key: "cantidad", label: "# Actions" },
    { key: "fecha", label: "Purchase Date" },
  ];

  const columnsVentas = [
    { key: "accion", label: "Action" },
    { key: "compra", label: "Purchase" },
    { key: "venta", label: "Sale" },
    { key: "pct", label: "%" },
    { key: "cantidad", label: "# Actions" },
    { key: "fecha", label: "Sale Date" },
  ];

  return (
    <>
      <SidebarNavAuth />

      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.headerRow}>
            <button onClick={() => router.back()} className={styles.backArrow}>
              <ArrowLeft size={28} />
            </button>
            <h1 className={styles.title}>
              {tab === "compras" ? "Purchases" : "Sales"}
            </h1>
            <div style={{ width: 28 }} />
          </div>

          <div className={styles.contenedorFiltro}>
            <div className={styles.dateFilter}>
              <label className={styles.dateLabel}>Since:</label>
              <input
                type="date"
                className={styles.dateInput}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />

              <label className={styles.dateLabel}>To:</label>
              <input
                type="date"
                className={styles.dateInput}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />

              <button
                type="button"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"></path>
                  <path d="M11.412,8.586C11.791,8.966,12,9.468,12,10h2c0-1.065-0.416-2.069-1.174-2.828c-1.514-1.512-4.139-1.512-5.652,0 l1.412,1.416C9.346,7.83,10.656,7.832,11.412,8.586z"></path>
                </svg>
              </button>
            </div>

            <div className={styles.switcher}>
              <button
                className={`${styles.switchBtn} ${
                  tab === "compras" ? styles.switchActive : ""
                }`}
                onClick={() => setTab("compras")}
              >
                Purchases
              </button>
              <button
                className={`${styles.switchBtn} ${
                  tab === "ventas" ? styles.switchActive : ""
                }`}
                onClick={() => setTab("ventas")}
              >
                Sales
              </button>
            </div>
          </div>

          <DataTable
            mode={tab}
            data={currentData}
            columns={tab === "compras" ? columnsCompras : columnsVentas}
          />
        </main>

        <RightPanel metrics={metrics} graphData={graphData} />

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
    </>
  );
}
