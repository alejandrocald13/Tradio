"use client";
import styles from "./landing.module.css";
import Image from "next/image";
import { Rocket, Shield, BarChart3 } from "lucide-react"; 

export default function LandingPage() {
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
          <button className={styles.login}>Login</button>
          <button className={styles.register}>Register</button>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Bienvenido!!!</h1>
          <p>Empieza a invertir con nosotros</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Rocket className={styles.icon} />
          </div>
          <p>
            Tradio te permite comprar y vender acciones en tiempo real (simulado) con una
              interfaz moderna e intuitiva, inspirada en plataformas líderes del
              mercado. Controla tus movimientos con precisión y confianza.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Shield className={styles.icon} />
          </div>
          <p>
            Cada transacción en Tradio está protegida con medidas de seguridad
              avanzadas. Tus datos, movimientos y ganancias permanecen siempre
              bajo control y respaldo constante.
          </p>
        </div>
      </section>
    </div>
  );
}
