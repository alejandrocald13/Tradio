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
      
      <Sidebar activeTab={tab} setTab={setTab} />

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Codigo de referidos</h1>
        </div>

        <p className={styles.description}>
          Invita a tus amigos a unirse y ganas. <br />
          Cada persona que se registre con tu código hará que recibas <strong>$5 de regalo.</strong></p>

        <section className={styles.cards}>
          
          <div className={styles.card}>
            <div className={styles.cardLeft}>
              <button
                className={styles.generateBtn}
                onClick={handleGenerateCode}
              >
                Mostrar código
              </button>
            </div>

            <div className={styles.cardRight}>
              <div className={styles.codeDisplay}>
                {generatedCode ? generatedCode : ""}
              </div>
            </div>
          </div>

         
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
                />
                <button
                  className={styles.sendBtn}
                  onClick={handleSubmitReferral}
                >
                  Enviar
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

