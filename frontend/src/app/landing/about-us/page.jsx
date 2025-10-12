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
        <div className={styles.flipCard}>
          <div className={styles.flipInner}>
            <div className={`${styles.card} ${styles.front}`}>
              <h2 className={styles.sectionTitle}>What is Tradio?</h2>
            </div>
            <div className={`${styles.card} ${styles.back}`}>
              <p>
                Tradio is a web application developed as part of the Web Programming 2025 project,
                created with the goal of offering a modern platform for buying and selling stocks.
                Inspired by platforms like Hapi, Tradio seeks to provide a complete experience
                for both investors and managers, combining an intuitive design with a
                secure and efficient infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Sobre Nosotros */}
        <div className={styles.flipCard}>
          <div className={styles.flipInner}>
            <div className={`${styles.card} ${styles.front}`}>
              <h2 className={styles.sectionTitle}>About Us</h2>
            </div>
            <div className={`${styles.card} ${styles.back}`}>
              <p>
                The team behind Tradio is made up of students passionate about technology,
                web development, and finance. Our goal is to apply the knowledge we have acquired
                in full-stack programming to create a robust, scalable, and secure application that reflects
                the demands of the real world.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}