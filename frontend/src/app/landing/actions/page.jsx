"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./actions.module.css";
import { useRouter } from "next/navigation";


import { api } from "../../lib/axios"; 

import ActionCard from "@/app/components/ActionCard";
import MiniChart from "@/app/components/MiniChart";
import Searcher from "@/app/components/Searcher";

export default function ActionsPage() {
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  

  const trendClass = { up: styles.positive, down: styles.negative, neutral: styles.neutral };
  const lastTyped = useRef("");

  const getValue = (value) => {
    const cleaned = value.trim().toUpperCase();
    if (cleaned !== "") {
        lastTyped.current = cleaned;
        return;
    }
    if (lastTyped.current.length >= 1) {
        const basePath = "/landing/actions";
        router.push(`${basePath}/${lastTyped.current}`);
    }
    lastTyped.current = "";
  };

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
    return (
      <div className={styles.mainContainerAuthRedirect}>
        <div className={styles.containerAuthRedirect}>
          <div className={styles.infoContainerARG}>
            <h1><svg className={styles.infoContainerARGSVG} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 .75c.172 0 .333.034.484.102a1.214 1.214 0 0 1 .664.664c.068.15.102.312.102.484s-.034.333-.102.484a1.214 1.214 0 0 1-.265.399 1.324 1.324 0 0 1-.399.273A1.254 1.254 0 0 1 8 3.25c-.172 0-.333-.031-.484-.094a1.324 1.324 0 0 1-.672-.672A1.254 1.254 0 0 1 6.75 2c0-.172.031-.333.094-.484.067-.151.159-.284.273-.399.115-.114.248-.203.399-.265A1.17 1.17 0 0 1 8 .75zM2.633 3.758a1.111 1.111 0 0 1 .68-1.031 1.084 1.084 0 0 1 .882 0c.136.057.253.138.352.242.104.099.185.216.242.351a1.084 1.084 0 0 1 0 .883 1.122 1.122 0 0 1-.594.594 1.169 1.169 0 0 1-.883 0 1.19 1.19 0 0 1-.359-.234 1.19 1.19 0 0 1-.234-.36 1.169 1.169 0 0 1-.086-.445zM2 7a.941.941 0 0 1 .703.297A.941.941 0 0 1 3 8a.97.97 0 0 1-.078.39 1.03 1.03 0 0 1-.531.532A.97.97 0 0 1 2 9a.97.97 0 0 1-.39-.078 1.104 1.104 0 0 1-.32-.211 1.104 1.104 0 0 1-.212-.32A.97.97 0 0 1 1 8a.97.97 0 0 1 .29-.703A.97.97 0 0 1 2 7zm.883 5.242a.887.887 0 0 1 .531-.805.863.863 0 0 1 .68 0c.11.047.203.11.281.188a.887.887 0 0 1 .188.96.887.887 0 0 1-1.148.461.913.913 0 0 1-.462-.46.863.863 0 0 1-.07-.344zM8 13.25c.208 0 .385.073.531.219A.723.723 0 0 1 8.75 14a.723.723 0 0 1-.219.531.723.723 0 0 1-.531.219.723.723 0 0 1-.531-.219A.723.723 0 0 1 7.25 14c0-.208.073-.385.219-.531A.723.723 0 0 1 8 13.25zm3.617-1.008c0-.177.06-.325.18-.445s.268-.18.445-.18.326.06.445.18c.12.12.18.268.18.445s-.06.326-.18.445a.605.605 0 0 1-.445.18.605.605 0 0 1-.445-.18.605.605 0 0 1-.18-.445zM14 7.5a.48.48 0 0 1 .352.148A.48.48 0 0 1 14.5 8a.48.48 0 0 1-.148.352A.48.48 0 0 1 14 8.5a.48.48 0 0 1-.352-.148A.48.48 0 0 1 13.5 8a.48.48 0 0 1 .148-.352A.48.48 0 0 1 14 7.5zm-1.758-5.117c.188 0 .365.036.531.11a1.413 1.413 0 0 1 .735.734c.073.166.11.343.11.53 0 .188-.037.365-.11.532a1.413 1.413 0 0 1-.735.734 1.31 1.31 0 0 1-.53.11c-.188 0-.365-.037-.532-.11a1.415 1.415 0 0 1-.734-.734 1.31 1.31 0 0 1-.11-.531c0-.188.037-.365.11-.531a1.413 1.413 0 0 1 .734-.735c.167-.073.344-.11.531-.11z"></path></svg></h1>
            <p className={styles.infoContainerARGP}>Loading market data...</p>
          </div>
        </div>
      </div>
    )
    
  }

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <div className={styles.logo}></div>
        <nav>
          <ul className={styles.menu}>
            <li><a href="/" className={styles.link}>HOME</a></li>
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
        <Searcher placeholderI="Search by symbol" getValue={getValue} />
        {/*<div className={styles.searchContainer}>
          
          
           <input 
            type="text" 
            placeholder="SEARCH" 
            className={styles.searchInput}
            value={searchQuery} // Conecta el valor al estado
            onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el estado al escribir
          />
        </div> */}
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

