"use client";

import { useRouter } from "next/navigation";
import ActionCard from "../components/ActionCard";
import SidebarNav from "../components/SidebarNav-Auth";
import MiniChart from "../components/MiniChart";
import Searcher from "../components/Searcher";
import { MOCK } from "../data/mockQuotes";
import "./actions.css";
import "../styles/sharedActionDetail.css";

export default function Actions() {
    const router = useRouter();
    const symbols = Object.keys(MOCK);
    const trendClass = { up: "td-up", down: "td-down", neutral: "td-neutral" };

    const getValue = (value) => {
        if (!value) return;

        const searchTerm = value.trim().toUpperCase();
        const foundSymbol = symbols.find((sym) => sym.toUpperCase() === searchTerm);
        const basePath = "/actions";
        const targetSymbol = foundSymbol || searchTerm;

        router.push(`${basePath}/${targetSymbol}`);
    };

    return (
        <>
            <SidebarNav />
            <div className="page-container">
                <div className="action-container">
                    <div className="search-divspace">
                        <Searcher placeholderI="Search by symbol" getValue={getValue} />
                    </div>

                    <div className="cards-divspace">
                        {symbols.map((sym) => {
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
                                    price={`$${data.last.toLocaleString()}`}
                                    changeText={`${amountText} ${pctText}`}
                                    variantClass={trendClass[trend]}
                                    graphic={<MiniChart data={data.intraday} />}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
