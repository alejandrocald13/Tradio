"use client";
import styles from "./landing.module.css";
import Image from "next/image";

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
        <div className={styles.heroImage}>
          <Image
            src="/hero-img.png"
            alt="Inversión"
            width={280}
            height={280}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <span className={styles.icon}>🚀</span>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit, lectus
            ultrices erat nisl maecenas platea integer dis, metus mauris
            fringilla suscipit dictum.
          </p>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.icon}>🛡️</span>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit, lectus
            ultrices erat nisl maecenas platea integer dis, metus mauris
            fringilla suscipit dictum.
          </p>
        </div>
      </section>
    </div>
  );
}
