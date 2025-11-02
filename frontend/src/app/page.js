"use client";
import styles from "./landing/landing.module.css";
import { Rocket, Shield } from "lucide-react"; 
import Link from "next/link";



export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
       <a href="/" className={styles.logo}>
      <img src="/logo_tradio_icon.png" alt="Tradio Logo" className={styles.logoImage} />
      </a>

        <nav>
          <ul className={styles.menu}>
            <li><Link href="/" className={`${styles.link} ${styles.active}`}>HOME</Link></li>
            <li><Link href="/landing/actions" className={styles.link}>ACTION</Link></li>
            <li><Link href="/landing/about-us" className={styles.link}>ABOUT US</Link></li>
          </ul>
        </nav>
        <div className={styles.authButtons}>
          <Link href="/api/auth/login?returnTo=/auth-redirect">
            <button className={styles.login}>Login</button>
          </Link>

          <Link href="/api/auth/signup?returnTo=/auth-redirect">
            <button className={styles.register}>Register</button>
          </Link>
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
