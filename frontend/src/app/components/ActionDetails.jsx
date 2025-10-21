"use client";
import { useState, useMemo } from "react";
import BigChart from "./BigChart";
import SlideActionPanel from "./SlideActionPanel";
import BuySellContent from "./BuySellContent";
import "../styles/ActionDetails.css";

export default function ActionDetails({
  subtitle = "Nasdaq GIDS · Delayed Quote",
  title = "Detail",
  price = 0,
  change = "—",
  changeTone = "neutral",
  tabs = ["1D","5D","1M","6M","1Y","5Y"],
  dataByTab = {}
}) {
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [tab, setTab] = useState(tabs[0] ?? "1D");

  const { data = [], labels = [], ref } = useMemo(
    () => dataByTab[tab] || {},
    [tab, dataByTab]
  );

  const refLine = Number.isFinite(Number(ref)) ? Number(ref) : undefined;

  const trendClass =
    changeTone === "up"   ? "td-up"   :
    changeTone === "down" ? "td-down" :
    "td-neutral";

  return (
    <div className="td-card">
      <div className="td-header">
        <div>
          <small className="td-subtitle">{subtitle}</small>
          <h2 className="td-title">{title}</h2>
        </div>
        <div className="td-transactions">
          <button 
            className="td-button-bs td-button-bs-primary"
            onClick={() => setIsBuyOpen(true)}
          >
            Buy
          </button>
          <button 
            className="td-button-bs"
            onClick={() => setIsSellOpen(true)}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="td-data-prices">
        <span className="td-price">${price}</span>
        <span className={`td-change ${trendClass}`}>{change}</span>
      </div>

      <div className="td-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`td-tab ${t === tab ? "td-active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="td-chartBox">
        <BigChart
          chartKey={`${title}-${tab}`}
          data={data}
          labels={labels}
          refLine={refLine}
          height={345}
        />
      </div>


      <SlideActionPanel isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)}>
        <BuySellContent
          mode="buy"
          data={{ title, subtitle, price, funds: 500 }}
          isOpen={isBuyOpen}
          onCancel={() => setIsBuyOpen(false)}
        />
      </SlideActionPanel>


      <SlideActionPanel isOpen={isSellOpen} onClose={() => setIsSellOpen(false)}>
        <BuySellContent
          mode="sell"
          data={{ title, subtitle, price }}
          isOpen={isSellOpen}
          onCancel={() => setIsSellOpen(false)}
        />
      </SlideActionPanel>


    </div>
  );
}
