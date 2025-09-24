
"use client";
import styles from "../purchases-sales/purchases-sales.module.css";

export default function ModalForm({ tab, form, setForm, onSubmit, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Agregar {tab === "compras" ? "Compra" : "Venta"}</h3>
        <form onSubmit={onSubmit} className={styles.modalForm}>
          <input
            placeholder="Acción"
            value={form.accion}
            onChange={(e) => setForm({ ...form, accion: e.target.value })}
          />
          <input
            placeholder="Precio compra"
            value={form.compra}
            onChange={(e) => setForm({ ...form, compra: e.target.value })}
          />
          {tab === "ventas" && (
            <input
              placeholder="Precio venta"
              value={form.venta}
              onChange={(e) => setForm({ ...form, venta: e.target.value })}
            />
          )}
          <input
            placeholder="# Acciones"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          />
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

