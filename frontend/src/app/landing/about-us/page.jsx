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
        {/* ¿Qué es Tradio  ? Section */}
        <div className={styles.contentBlock}>
          <div className={styles.contentHeader}>
            <div className={styles.divider}></div>
            <h2 className={styles.sectionTitle}>¿Qué es Tradio?</h2>
            <div className={styles.divider}></div>
          </div>
          <div className={styles.contentText}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, lectus ultrices erat nisl
              maecenas platea integer dis, metus mauris fringilla suscipit dictumst sagittis.
              Elementum pharetra facilisis vitae nisi dis donec ullamcorper, tellus aptent class mattis
              dapibus tristique quisque lacus, erat tempus lobortis metus scelerisque nunc.
            </p>
          </div>
        </div>

        {/* Sobre Nosotros Section */}
        <div className={styles.contentBlock}>
          <div className={styles.contentHeader}>
            <div className={styles.divider}></div>
            <h2 className={styles.sectionTitle}>Sobre Nosotros</h2>
            <div className={styles.divider}></div>
          </div>
          <div className={styles.contentText}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit, lectus ultrices erat nisl
              maecenas platea integer dis, metus mauris fringilla suscipit dictumst sagittis.
              Elementum pharetra facilisis vitae nisi dis donec ullamcorper, tellus aptent class mattis
              dapibus tristique quisque lacus, erat tempus lobortis metus scelerisque nunc.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}