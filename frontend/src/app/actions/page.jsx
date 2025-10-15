"use client";
import ActionCard from "../components/ActionCard";
import "./actions.css";
import SidebarNav from "../components/SidebarNav-Auth";
import MiniChart from "../components/MiniChart";
import { MOCK } from "../data/mockQuotes";




export default function Actions() {
    const symbols = Object.keys(MOCK); // ["TSLA","NVDA",...]
    const trendClass = { up: "td-up", down: "td-down", neutral: "td-neutral" };

    return (
        <>
            <SidebarNav />
            <div className="page-container">
                <div className="action-container">
                    {symbols.map((sym) => {
                        // Calculos para la diferencia de precios y el pocentaje
                        const data = MOCK[sym];
                        const changeAbs = data.last - data.prevClose;
                        const changePct = data.prevClose ? (changeAbs / data.prevClose) * 100 : 0;

                        const sign = changeAbs > 0 ? "+" : changeAbs < 0 ? "-" : "";
                        const amountText = `${sign}${Math.abs(changeAbs).toFixed(2)}`;
                        const pctText = `(${sign}${Math.abs(changePct).toFixed(2)}%)`;
                        const trend = changeAbs > 0 ? "up" : changeAbs < 0 ? "down" : "neutral";

                        return (
                            <ActionCard
                                key={sym}
                                symbol={sym}
                                actionName={data.name}
                                price={data.last.toLocaleString()}
                                changeText={`${amountText} ${pctText}`}   
                                variantClass={trendClass[trend]}           
                                graphic={<MiniChart data={data.intraday} />}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
