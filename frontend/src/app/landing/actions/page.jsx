// app/landing/actions/page.jsx
"use client";
import { useState, useEffect } from "react";
import styles from "./actions.module.css";

export default function ActionsPage() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo que coinciden con la imagen
  const mockMarketData = [
    {
      name: "Russell 2000 Index (ARUT)",
      value: "2,391.05",
      exchange: "Chicago Options - Delayed Queue",
      change: "+11.43",
      changePercent: "-10.48%"
    },
    {
      name: "COMEX",
      value: "3,653.30",
      exchange: "COMEX - Delayed Queue",
      change: "+46.60",
      changePercent: "-11.29%"
    },
    {
      name: "COMEX",
      value: "3,653.30",
      exchange: "Chicago Options - Delayed Queue",
      change: "+46.60",
      changePercent: "-11.29%"
    },
    {
      name: "COMEX",
      value: "3,653.30",
      exchange: "COMEX - Delayed Queue",
      change: "+46.60",
      changePercent: "-11.29%"
    },
    {
      name: "COMEX",
      value: "3,653.30",
      exchange: "Chicago Options - Delayed Queue",
      change: "+46.60",
      changePercent: "-11.29%"
    },
    {
      name: "DJI",
      value: "45,400.86",
      exchange: "Delayed Queue",
      change: "-220.43",
      changePercent: "-0.48%"
    },
    {
      name: "Nasdaq GIDS",
      value: "21,700.39",
      exchange: "Delayed Queue",
      change: "-7.30",
      changePercent: "-0.03%"
    },

    {
      name: "COMEX",
      value: "3,653.30",
      exchange: "COMEX - Delayed Queue",
      change: "+46.60",
      changePercent: "-11.29%"
    },
    {
      name: "DJI",
      value: "45,400.86",
      exchange: "Delayed Queue",
      change: "-220.43",
      changePercent: "-0.48%"
    }
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Aquí iría tu llamada al backend
        // const response = await fetch('/api/market-data');
        // const data = await response.json();
        
        setMarketData(mockMarketData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Cargando datos de mercado...</div>;
  }

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
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

      {/* SEARCH BAR */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>Q</span>
          <input 
            type="text" 
            placeholder="SEARCH" 
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* MARKET DATA - LAYOUT VERTICAL IZQUIERDA Y DERECHA */}
      <section className={styles.marketSection}>
        <div className={styles.marketColumns}>
          {/* Columna Izquierda - 3 componentes */}
          <div className={styles.column}>
            {marketData.slice(0, 3).map((item, index) => (
              <div key={index} className={styles.marketCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.stockName}>{item.name}</div>
                  <div className={styles.stockValue}>{item.value}</div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.stockExchange}>{item.exchange}</div>
                  <div className={styles.stockChange}>
                    <span className={item.change.includes('+') ? styles.positive : styles.negative}>
                      {item.change} ({item.changePercent})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Columna Derecha - 3 componentes */}
          <div className={styles.column}>
            {marketData.slice(3, 6).map((item, index) => (
              <div key={index} className={styles.marketCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.stockName}>{item.name}</div>
                  <div className={styles.stockValue}>{item.value}</div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.stockExchange}>{item.exchange}</div>
                  <div className={styles.stockChange}>
                    <span className={item.change.includes('+') ? styles.positive : styles.negative}>
                      {item.change} ({item.changePercent})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRÁFICOS ABAJO */}
        <div className={styles.chartsSection}>
          <div className={styles.chartsGrid}>
            <div className={styles.chartPlaceholder}>
              <p>Gráfico Russell 2000</p>   
              {/* Aquí integrarás el gráfico del backend */}
            </div>
            <div className={styles.chartPlaceholder}>
              <p>Gráfico COMEX</p>
              {/* Aquí integrarás el gráfico del backend */}
            </div>
            <div className={styles.chartPlaceholder}>
              <p>Gráfico DJI</p>
              {/* Aquí integrarás el gráfico del backend */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}