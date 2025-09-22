"use client";

import { useState } from "react";
import styles from "./referrals.module.css";
import Sidebar from "../components/Sidebar"; 

export default function ReferralsPage() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [referralInput, setReferralInput] = useState("");
  const [tab, setTab] = useState("referrals"); 

  const handleGenerateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setGeneratedCode(code);
  };

  const handleSubmitReferral = () => {
    if (!referralInput) {
      alert("Por favor ingresa un código de referido.");
      return;
    }
    alert(`Código ingresado: ${referralInput}`);
    setReferralInput("");
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar reutilizable */}
      <Sidebar activeTab={tab} setTab={setTab} />

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Código de referidos</h1>
          <div className={styles.illustration}>
            <img
              src="/next.svg"
              alt="Ilustración"
              className={styles.illustrationImg}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        <p className={styles.description}>
          TexLorem ipsum dolor sit amet consectetur adipiscing elit, lectus
          ultrices erat nisl maecenas platea integer dis, metus mauris
          fringilla suscipit dictumst sagittis. Elementum pharetra facilisis
          vitae nisi dis donec ullamcorper, tellus aptent class mattis dapibus
          tristique quisque lacus, erat tempus lobortis metus scelerisque nunc.
        </p>

        <section className={styles.cards}>
          {/* Generar código */}
          <div className={styles.card}>
            <button className={styles.greenBtn} onClick={handleGenerateCode}>
              Generar código
            </button>
            <div className={styles.codePill}>
              {generatedCode ? generatedCode : ""}
            </div>
          </div>

          {/* Ingresar código */}
          <div className={styles.card}>
            <div className={styles.enterLeft}>
              <div className={styles.enterLabel}>
                Ingresar código de <br /> referido
              </div>
            </div>

            <div className={styles.enterRight}>
              <input
                type="text"
                placeholder="Código"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                className={styles.inputPill}
              />
              <button
                className={styles.submitBtn}
                onClick={handleSubmitReferral}
              >
                Enviar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
