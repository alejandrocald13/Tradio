"use client";

import { useState } from "react";
import styles from "./referrals.module.css";
import SidebarNav from "../components/SidebarNav-Auth";
import { api } from "../lib/axios";

export default function ReferralsPage() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [referralInput, setReferralInput] = useState("");
  const [tab, setTab] = useState("referrals");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mostrar el código de referido propio desde /users/me
  const handleShowCode = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/me");
      const code = res?.data?.profile?.referral_code || "";
      if (!code) {
        alert("Aún no tienes código de referido configurado.");
        setGeneratedCode("");
        return;
      }
      setGeneratedCode(code.toUpperCase());
    } catch (err) {
      console.error("Error al obtener el código:", err);
      alert("No se pudo obtener tu código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Usar el código de otra persona (envía POST a /wallet/referral/apply/)
  const handleSubmitReferral = async () => {
    if (!referralInput) {
      alert("Por favor ingresa un código de referido.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/wallet/referral/apply/", {
        code: referralInput.trim(),
      });

      if (res.status === 200) {
        const detail = res.data?.detail || "Código aplicado correctamente.";
        alert(`${detail}\nDueño del código: ${res.data?.credited_user}`);
      } else {
        alert("No se pudo aplicar el código. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error aplicando código:", err);
      const msg =
        err.response?.data?.detail ||
        "Ocurrió un error al usar el código. Verifica que sea válido.";
      alert(msg);
    } finally {
      setSubmitting(false);
      setReferralInput("");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <SidebarNav/>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Código de referidos</h1>
          </div>

          <p className={styles.description}>
            Invita a tus amigos a unirse y gana. <br />
            Cada persona que se registre con tu código hará que recibas{" "}
            <strong>$5 de regalo.</strong>
          </p>

          <section className={styles.cards}>
            {/* Mostrar código */}
            <div className={styles.card}>
              <div className={styles.cardLeft}>
                <button
                  className={styles.generateBtn}
                  onClick={handleShowCode}
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Mostrar código"}
                </button>
              </div>

              <div className={styles.cardRight}>
                <div className={styles.codeDisplay}>
                  {generatedCode || ""}
                </div>
              </div>
            </div>

            {/* Usar código */}
            <div className={styles.card}>
              <div className={styles.cardLeftLabel}>
                Ingresar código de <br /> referido
              </div>

              <div className={styles.cardRight}>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.codeInput}
                    type="text"
                    placeholder="Código"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    className={styles.sendBtn}
                    onClick={handleSubmitReferral}
                    disabled={submitting}
                  >
                    {submitting ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
