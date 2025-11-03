"use client";

import { useState,useEffect } from "react";
import styles from "./referrals.module.css";
import SidebarNav from "../../../components/SidebarNav-Auth";
import { api } from "../../../lib/axios";
import Modal from "../../../components/Modal";

export default function ReferralsPage() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [referralInput, setReferralInput] = useState("");
  const [tab, setTab] = useState("referrals");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: null });
  const [hasAppliedCode, setHasAppliedCode] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
      const checkReferralStatus = async () => {
        try {
          const res = await api.get("/users/me");
          const profile = res?.data?.profile;
          if (profile && profile.has_used_referral) {
            setHasAppliedCode(true);
            
          }
        } catch (err) {
          console.error("Error checking referral status:", err);
        } finally {
          setCheckingStatus(false);
        }
      };

      checkReferralStatus();
    }, []);

  const showModal = (title, content) => {
    setModalContent({
      title,
      body: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            textAlign: "center",
          }}
        >
          {typeof content === "string" ? <p>{content}</p> : content}
          <button
            className={styles.sendBtn}
            onClick={() => setIsModalOpen(false)}
            style={{ width: "100px" }}
          >
            OK
          </button>
        </div>
      ),
    });
    setIsModalOpen(true);
  };

  
  const handleShowCode = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/me");
      const code = res?.data?.profile?.referral_code || "";

      if (!code) {
        showModal("Aviso", "Aún no tienes código de referido configurado.");
        setGeneratedCode("");
        return;
      }

      setGeneratedCode(code.toUpperCase());
    } catch (err) {
      console.error("Error al obtener el código:", err);
      showModal("Error", "No se pudo obtener tu código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

 
  const handleSubmitReferral = async () => {
    if (!referralInput) {
      showModal("Alerta", "Por favor ingresa un código de referido.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/wallet/referral/apply/", {
        code: referralInput.trim(),
      });

      if (res.status === 200) {
        const detail = res.data?.detail || "Código aplicado correctamente.";
        const creditedUser = res.data?.credited_user || "Usuario desconocido";
        showModal("Éxito", `${detail}\nDueño del código: ${creditedUser}`);
        setHasAppliedCode(true);
      } else {
        showModal("Error", "No se pudo aplicar el código. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error aplicando código:", err);
      const msg =
        err.response?.data?.detail ||
        "Ocurrió un error al usar el código. Verifica que sea válido.";
      showModal("Error", msg);
    } finally {
      setSubmitting(false);
      setReferralInput("");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <SidebarNav />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Referral code</h1>
          </div>

          <p className={styles.description}>
            Invite your friends to join and win. <br />
            Each person who registers with your code will earn you{" "}
            <strong>$5 in rewards.</strong>
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
                  {loading ? "loading..." : "Show code"}
                </button>
              </div>

              <div className={styles.cardRight}>
                <div className={styles.codeDisplay}>{generatedCode || ""}</div>
              </div>
            </div>

            {/* Usar código */}
            <div className={styles.card}>
              <div className={styles.cardLeftLabel}>
                Enter referral <br /> code
              </div>

              <div className={styles.cardRight}>
                <div className={styles.inputWrap}>
                  <div className={styles.tooltipWrapper}>
                    <input
                      className={`${styles.codeInput} ${
                        hasAppliedCode ? styles.disabledInput : ""
                      }`}
                      type="text"
                      placeholder="Code"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      disabled={submitting || hasAppliedCode || checkingStatus}
                    />


                  </div>

                  <div className={styles.tooltipWrapper}>
                    <button
                      className={`${styles.sendBtn} ${
                        hasAppliedCode ? styles.disabledAfterUse : ""
                      }`}
                      onClick={() => {
                        if (hasAppliedCode) return;
                        handleSubmitReferral();
                      }}
                      disabled={submitting || hasAppliedCode || checkingStatus}
                    >
                      {hasAppliedCode
                        ? "Send"
                        : submitting
                        ? "Sending..."
                        : "Send"}
                    </button>
                      {hasAppliedCode && (
                      <div className={styles.tooltip}>
                        You have already applied a reference code.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

     
      <Modal
        isOpen={isModalOpen}
        title={modalContent.title}
        onClose={() => setIsModalOpen(false)}
      >
        {modalContent.body}
      </Modal>
    </div>
  );
}
