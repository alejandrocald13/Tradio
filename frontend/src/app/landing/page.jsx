"use client";
import styles from "./landing.module.css";
import { Rocket, Shield } from "lucide-react"; 
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getIdTokenClaims
  } = useAuth0();

  const [message, setMessage] = useState(null);

  useEffect(() => {
    const sendTokenToBackend = async () => {
      try {
        const claims = await getIdTokenClaims();
        const token = claims.__raw;

        const response = await api.post("/auth/login/", { auth0_token: token });

        if (response.status === 200) {
          setMessage("Inicio de sesión exitoso.");
          console.log("Cookie JWT configurada en el backend");
        }

      } catch (err) {
        if (err.response) {
          const { status, data } = err.response;

          if (status === 403) {
            setMessage(data.message || "Acceso restringido.");
          } else if (status === 400) {
            setMessage("Token inválido o sesión expirada.");
          } else {
            setMessage("Error inesperado al autenticar.");
          }

          logout({ logoutParams: { returnTo: window.location.origin } });
        } else {
          console.error("Error al enviar token al backend:", err);
          setMessage("Error de conexión con el servidor.");
        }
      }
    };

    if (!isLoading && isAuthenticated) {
      sendTokenToBackend();
    }
    }, [isAuthenticated, isLoading]);

    
  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.logo}></div>
        <nav>
          <ul className={styles.menu}>
            <li><a href="/landing" className={`${styles.link} ${styles.active}`}>HOME</a></li>
            <li><a href="/landing/actions" className={styles.link}>ACTION</a></li>
            <li><a href="/landing/about-us" className={styles.link}>ABOUT US</a></li>
          </ul>
        </nav>
        <div className={styles.authButtons}>
          <button className={styles.login} onClick={() => loginWithRedirect({ prompt: "login" })}>Login</button>
          <button className={styles.register} onClick={() => loginWithRedirect({ screen_hint: "signup" })}>Register</button>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Welcome!!!</h1>
          <p>Start investing with us</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Rocket className={styles.icon} />
          </div>
          <p>
            Tradio allows you to buy and sell stocks in real-time (simulated) with a
              modern and intuitive interface, inspired by leading platforms in the
              market. Control your movements with precision and confidence.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Shield className={styles.icon} />
          </div>
          <p>
            Each transaction on Tradio is protected with advanced security measures.
            Your data, movements, and profits are always under control and constant backup.
          </p>
        </div>
      </section>
    </div>
  );
}
