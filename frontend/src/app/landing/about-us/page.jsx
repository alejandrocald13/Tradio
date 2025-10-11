// app/landing/about-us/page.jsx
"use client";
import styles from "./about-us.module.css";

export default function AboutUsPage() {
  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.logo}></div>
        <nav>
          <ul className={styles.menu}>
            <li><a href="/landing" className={styles.link}>HOME</a></li>
            <li><a href="/landing/actions" className={styles.link}>ACTION</a></li>
            <li><a href="/landing/about-us" className={`${styles.link} ${styles.active}`}>ABOUT US</a></li>
          </ul>
        </nav>
        <div className={styles.authButtons}>
          <button className={styles.login}>Login</button>
          <button className={styles.register}>Register</button>
        </div>
      </header>

      

      {/* CONTENT SECTION */}
      <section className={styles.contentSection}>
      {/* ¿Qué es Tradio? */}
      <div className={`${styles.contentBlock} ${styles.card}`}>
        <div className={styles.contentHeader}>
          <div className={styles.divider}></div>
          <h2 className={styles.sectionTitle}>¿Qué es Tradio?</h2>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.contentText}>
          <p>
            Tradio es una aplicación web desarrollada como parte del proyecto de Programación Web 2025, 
            creada con el objetivo de ofrecer una plataforma moderna para la compra y venta de acciones 
            bursátiles. Inspirada en plataformas como Hapi, Tradio busca brindar una experiencia completa 
            tanto para inversionistas como para administradores, combinando un diseño intuitivo con una 
            infraestructura segura y eficiente.
          </p>
        </div>
      </div>

      {/* Sobre Nosotros */}
      <div className={`${styles.contentBlock} ${styles.card}`}>
        <div className={styles.contentHeader}>
          <div className={styles.divider}></div>
          <h2 className={styles.sectionTitle}>Sobre Nosotros</h2>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.contentText}>
          <p>
            El equipo detrás de Tradio está conformado por estudiantes apasionados por la tecnología, 
            el desarrollo web y las finanzas. Nuestro propósito es aplicar los conocimientos adquiridos 
            en programación full stack para crear una aplicación robusta, escalable y segura que refleje 
            las exigencias del mundo real.
          </p>
        </div>
      </div>
    </section>
    </div>
  );
}