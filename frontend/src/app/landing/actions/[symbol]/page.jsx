import SharedActionDetail from "@/app/components/SharedActionDetail";
import styles from "../actions.module.css";

export default async function LandingActionDetailPage({ params }) {
    const { symbol } = await params;

    return (
        <div className={styles.container}>
            <header className={styles.navbar}>
                <div className={styles.logo}></div>
                <nav>
                <ul className={styles.menu}>
                    <li><a href="/landing" className={styles.link}>HOME</a></li>
                    <li><a href="/landing/actions" className={`${styles.link} ${styles.active}`}>ACTION</a></li>
                    <li><a href="/landing/about-us" className={styles.link}>ABOUT US</a></li>
                </ul>
                </nav>
                <div className={styles.authButtons}>
                <button className={styles.login}>Login</button>
                <button className={styles.register}>Register</button>
                </div>
            </header>
            <SharedActionDetail symbol={symbol} isPublic={true} />
        </div>
    );
}
