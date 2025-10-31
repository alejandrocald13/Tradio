"use client";
import { useMemo, useState } from "react";
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
  tabs = ["1D", "5D", "1M", "6M", "1Y", "5Y"],
  dataByTab = {},
  isPublic = false,
  currentTab,
  onTabChange,
  id = 0,
}) {
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);

  const { data = [], labels = [], ref } = useMemo(
    () => dataByTab[currentTab] || {},
    [currentTab, dataByTab]
  );

  const refLine = Number.isFinite(Number(ref)) ? Number(ref) : undefined;

  const trendClass =
    changeTone === "up"   ? "td-up"   :
    changeTone === "down" ? "td-down" :
    "td-neutral";

  // const isMarketOpen = () => {
  //   const now = new Date();

  //   const guatemalaTime = new Date(
  //     now.toLocaleString('en-US', { timeZone: 'America/Guatemala' })
  //   );

  //   const day = guatemalaTime.getDay();
  //   if (day === 0 || day === 6) return false;

  //   const hour = guatemalaTime.getHours();
  //   const minute = guatemalaTime.getMinutes();
  //   const currentTime = hour * 60 + minute;

  //   const startTime = 8 * 60;
  //   const endTime = 20 * 60;

  //   return currentTime >= startTime && currentTime <= endTime;
  // };

  const marketClosed = false;

  return (
    <div className="td-card">
      <div className="td-header">
        <div>
          <small className="td-subtitle">{subtitle}</small>
          <h2 className="td-title">{title}</h2>
        </div>
        <div className="td-transactions">
          {!isPublic && (
            <>
              <button
                onClick={() => !marketClosed && setIsBuyOpen(true)}
                disabled={marketClosed}
                className={`td-button-bs td-button-bs-primary ${marketClosed ? "td-disabled-market" : ""}`}
              >
                Buy
              </button>

              <button
                onClick={() => !marketClosed && setIsSellOpen(true)}
                disabled={marketClosed}
                className={`td-button-bs ${marketClosed ? "td-disabled-market" : ""}`}
              >
                Sell
              </button>
            </>
          )}
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
            onClick={() => onTabChange(t)}
            className={`td-tab ${t === currentTab ? "td-active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="td-chartBox">
        <BigChart
          chartKey={`${title}-${currentTab}`}
          data={data}
          labels={labels}
          refLine={refLine}
          height={345}
        />
      </div>


      <SlideActionPanel isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)}>
        <BuySellContent
          id={id}
          mode="buy"
          data={{ title, subtitle, price, funds: 500 }}
          isOpen={isBuyOpen}
          onCancel={() => setIsBuyOpen(false)}
        />
      </SlideActionPanel>


      <SlideActionPanel isOpen={isSellOpen} onClose={() => setIsSellOpen(false)}>
        <BuySellContent
          id={id}
          mode="sell"
          data={{ title, subtitle, price }}
          isOpen={isSellOpen}
          onCancel={() => setIsSellOpen(false)}
        />
      </SlideActionPanel>


    </div>
  );
}
