// app/landing/actions/page.jsx
"use client";
import { useState, useEffect } from "react";
import styles from "./actions.module.css";


import ActionCard from "@/app/components/ActionCard";
import MiniChart from "@/app/components/MiniChart";
import { MOCK } from "@/app/data/mockQuotes";

export default function ActionsPage() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  const symbols = Object.keys(MOCK); 
  const trendClass = { up: styles.positive, down: styles.negative, neutral: styles.neutral };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        
        const formatted = symbols.map((sym) => {
          const data = MOCK[sym];
          const changeAbs = data.last - data.prevClose;
          const changePct = data.prevClose ? (changeAbs / data.prevClose) * 100 : 0;
          const sign = changeAbs > 0 ? "+" : changeAbs < 0 ? "-" : "";

          return {
            name: data.name,
            symbol: sym,
            value: `$${data.last.toLocaleString()}`,
            exchange: "NASDAQ - Mock Data",
            change: `${sign}${Math.abs(changeAbs).toFixed(2)}`,
            changePercent: `${sign}${Math.abs(changePct).toFixed(2)}%`,
            trend: changeAbs > 0 ? "up" : changeAbs < 0 ? "down" : "neutral",
            intraday: data.intraday,
            tabs: data.tabs
          };
        });

        setMarketData(formatted);
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
  {/* Bloque Izquierdo */}
  <div className={styles.marketBlock}>
    <h2 className={`${styles.blockTitle} ${styles.gains}`}>Top: Ganancias</h2>
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

  {/* Bloque Derecho */}
  <div className={styles.marketBlock}>
    <h2 className={`${styles.blockTitle} ${styles.losses}`}>Top: Pérdidas</h2>
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
      
      <h2 className={styles.actionsTitle}>Acciones Disponibles</h2>
        <div className={styles.actionCardsGrid}>
          {symbols.map((sym) => {
            const data = MOCK[sym];
            const changeAbs = data.last - data.prevClose;
            const changePct = data.prevClose ? (changeAbs / data.prevClose) * 100 : 0;
            const sign = changeAbs > 0 ? "+" : changeAbs < 0 ? "-" : "";
            const amountText = `${sign}${Math.abs(changeAbs).toFixed(2)}`;
            const pctText = `(${sign}${Math.abs(changePct).toFixed(2)}%)`;
            const trend = changeAbs > 0 ? "up" : changeAbs < 0 ? "down" : "neutral";

            return (
              <div key={sym} className={styles.actionCardWrapper}>
                <ActionCard
                  symbol={sym}
                  actionName={data.name}
                  price={`$${data.last.toLocaleString()}`}
                  changeText={`${amountText} ${pctText}`}   
                  variantClass={trendClass[trend]}           
                  graphic={<MiniChart data={data.intraday} />}
                />
              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
}