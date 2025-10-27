"use client";
import styles from "./landing.module.css";
import { Rocket, Shield } from "lucide-react"; 
import { api } from "../lib/axios";
import { useEffect, useState } from "react";


import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@auth0/nextjs-auth0";


export default function LandingPage() {

  const [message, setMessage] = useState(null);
  const {user, error, isLoading} = useUser();
  const router = useRouter()

  console.log("user", user)

useEffect(() => {
  if (!isLoading && user) {
    console.log("user2", user)
    if (user.is_superuser) {
      router.push("/adminHome");
    } else {
      router.push("/authHome");
    }
  }
}, [user, isLoading]);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar usuario</p>;


  return (
    <div className={styles.container}>
      {user &&(
        <p>Hola user {user.name}</p>
      )}
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
          <a href="/api/auth/login">
            <button className={styles.login}>Login</button>
          </a>

          <a href="/api/auth/signup">
            <button className={styles.register}>Register</button>
          </a>
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
