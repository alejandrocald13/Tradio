
import Link from "next/link";
import styles from "../purchases-sales/purchases-sales.module.css";

export default function Sidebar({ activeTab }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoCircle}>CP</div>
        <div className={styles.logoText}>MiCuenta</div>
      </div>

      <nav className={styles.nav}>
        <Link
          href="/profile"
          className={`${styles.navItem} ${
            activeTab === "profile" ? styles.active : ""
          }`}
        >
          <span className={styles.icon}>👤</span>
          <span>Profile</span>
        </Link>

        <Link
            href="/purchases-sales"
            className={`${styles.navItem} ${
                activeTab === "compras" || activeTab === "ventas" ? styles.active : ""
            }`}
            >
            <span className={styles.icon}>💰</span>
            <span>Purchases / Sales</span>
        </Link>


        <Link
          href="/referrals"
          className={`${styles.navItem} ${
            activeTab === "referrals" ? styles.active : ""
          }`}
        >
          <span className={styles.icon}>👥</span>
          <span>Referrals</span>
        </Link>
      </nav>
    </aside>
  );
}


