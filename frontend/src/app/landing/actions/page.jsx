"use client";
import { useState, useEffect } from "react";
import styles from "./actions.module.css";

import { api } from "../../lib/axios"; 

import ActionCard from "@/app/components/ActionCard";
import MiniChart from "@/app/components/MiniChart";

export default function ActionsPage() {
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const trendClass = { up: styles.positive, down: styles.negative, neutral: styles.neutral };

  useEffect(() => {
    const fetchMarketData = async () => {
      console.log("Iniciando carga de datos del mercado...");
      try {
        const [gainersRes, losersRes, historyRes] = await Promise.all([
          api.get("/stocks-market/top_gainers/"),
          api.get("/stocks-market/top_losers/"),
          api.get("/stocks-history/all_history/") 
        ]);

        console.log("Datos recibidos:", { gainersRes, losersRes, historyRes });

        const gainersData = gainersRes.data; 
        const losersData = losersRes.data;   
        const historyData = historyRes.data; 

        setTopGainers(gainersData.top_gainers);
        setTopLosers(losersData.top_losers);

        
        const formattedActions = historyData.stocks.map(stock => {
          
          const last = stock.current_price;
          const intradayData = stock.data.c || []; 
          let basePrice = null;
          if (intradayData.length > 0) {
            basePrice = intradayData[0];
          } 
          if (basePrice === null) {
            basePrice = last; 
          }
          
          
          const changeAbs = last - basePrice;
          const changePct = (basePrice !== 0) ? (changeAbs / basePrice) * 100 : 0; // Evitar división por cero
          
          const sign = changeAbs > 0 ? "+" : changeAbs < 0 ? "-" : "";
          const trend = changeAbs > 0 ? "up" : changeAbs < 0 ? "down" : "neutral";

          return {
            name: stock.name, 
            symbol: stock.symbol,
            value: `$${last.toLocaleString()}`,
            exchange: stock.exchange || "NASDAQ - API Data",
            change: `${sign}${Math.abs(changeAbs).toFixed(2)}`,
            changePercent: `${sign}${Math.abs(changePct).toFixed(2)}%`,
            trend: trend,
            intraday: intradayData, 
            tabs: stock.tabs || {} 
          };
        });

        setAvailableActions(formattedActions);
        setLoading(false);
        console.log("Datos cargados y formateados.");

      } catch (error) {
        console.error("Error al cargar los datos del mercado:", error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []); 


  const filteredActions = availableActions.filter(action => 
    action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className={styles.loading}>Loading market data...</div>;
  }

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
          <a href="/api/auth/login?returnTo=/auth-redirect">
            <button className={styles.login}>Login</button>
          </a>

          <a href="/api/auth/signup?returnTo=/auth-redirect">
            <button className={styles.register}>Register</button>
          </a>

        </div>
      </header>

      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>Q</span>
          
          <input 
            type="text" 
            placeholder="SEARCH" 
            className={styles.searchInput}
            value={searchQuery} // Conecta el valor al estado
            onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el estado al escribir
          />
        </div>
      </div>

      <section className={styles.marketSection}>
        <div className={styles.marketColumns}>
          
          <div className={styles.marketBlock}>
            <h2 className={`${styles.blockTitle} ${styles.gains}`}>Top Gainers</h2>
            {topGainers.map((item, index) => {
              const changeAbs = item.current_price - item.open_price;
              const sign = changeAbs >= 0 ? "+" : "-";
              
              return (
                <div key={index} className={styles.marketCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stockName}>{item.name}</div>
                    <div className={styles.stockValue}>${item.current_price.toLocaleString()}</div>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.stockExchange}>{item.exchange || "NASDAQ"}</div>
                    <div className={styles.stockChange}>
                      <span className={styles.positive}>
                        {sign}${Math.abs(changeAbs).toFixed(2)} ({item.change_percentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.marketBlock}>
            <h2 className={`${styles.blockTitle} ${styles.losses}`}>Top Losers</h2>
            {topLosers.map((item, index) => {
              const changeAbs = item.current_price - item.open_price;
              const sign = changeAbs >= 0 ? "+" : "-"; 
              
              return (
                <div key={index} className={styles.marketCard}>
                    <div className={styles.cardHeader}>
                     <div className={styles.stockName}>{item.name}</div>
                     <div className={styles.stockValue}>${item.current_price.toLocaleString()}</div>
                   </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.stockExchange}>{item.exchange || "NASDAQ"}</div>
                    <div className={styles.stockChange}>
                      <span className={styles.negative}>
                         {sign}${Math.abs(changeAbs).toFixed(2)} ({item.change_percentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.actionsContainer}>
          <h2 className={styles.actionsTitle}>Available Actions</h2>
          <div className={styles.actionCardsGrid}>
            
            {filteredActions.map((item) => (
              <div key={item.symbol} className={styles.actionCardWrapper}>
                <ActionCard
                  symbol={item.symbol}
                  actionName={item.name}
                  price={item.value}
                  changeText={`${item.change} (${item.changePercent})`}
                  variantClass={trendClass[item.trend]}
                  graphic={<MiniChart data={item.intraday} />}
                />
              </div>
            ))}

            
            {filteredActions.length === 0 && searchQuery.length > 0 && (
              <p>No se encontraron acciones para "{searchQuery}"</p>
            )}

          </div>
        </div>

      </section>
    </div>
  );
}

