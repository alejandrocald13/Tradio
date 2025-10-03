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
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Codigo de referidos</h1>

          <div className={styles.illustration}>
            <img
              src="/Gift.png"
              alt="Ilustración"
              className={styles.illustrationImg}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        <p className={styles.description}>
          El sistema de códigos de referido ha sido creado para que invitar a amigos o clientes 
          sea sencillo y beneficioso para todos. Al compartir tu código único, las personas que 
          se registren con él recibirán automáticamente $5 de regalo en su cuenta al crearla, 
          lo que les permitirá comenzar a disfrutar de nuestros servicios con una ventaja inicial. 
          Al mismo tiempo, tú también recibirás beneficios especiales por cada referido que utilice 
          tu código, lo que convierte cada invitación en una oportunidad de ganar más. 
        </p>

        <section className={styles.cards}>
          
          <div className={styles.card}>
            <div className={styles.cardLeft}>
              <button
                className={styles.generateBtn}
                onClick={handleGenerateCode}
              >
                Generar código
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
      </main>
    </div>
  );
}
