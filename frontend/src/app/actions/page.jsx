"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ActionCard from "../components/ActionCard";
import SidebarNav from "../components/SidebarNav-Auth";
import MiniChart from "../components/MiniChart";
import Searcher from "../components/Searcher";
import { MOCK } from "../data/mockQuotes";
import "./actions.css";

export default function Actions() {
    const router = useRouter();
    const symbols = Object.keys(MOCK); // ["TSLA", "NVDA", ...]
    const trendClass = { up: "td-up", down: "td-down", neutral: "td-neutral" };
    const [lastSearch, setLastSearch] = useState("");
    const [notFound, setNotFound] = useState(false);

    const getValue = (value) => {
        if (!value) return;

        const searchTerm = value.trim().toUpperCase();
        setLastSearch(searchTerm);
        setNotFound(false);

        const foundSymbol = symbols.find((sym) => sym.toUpperCase() === searchTerm);
        const targetSymbol = foundSymbol || searchTerm;
        if (foundSymbol) {
            router.push(`/actions/${targetSymbol}`);
        } else {
            setNotFound(true);
        }
    };

    return (
        <>
            <SidebarNav />
            <div className="page-container">
                <div className="action-container">
                    <div className="search-divspace">
                        <Searcher placeholderI="Search by symbol" getValue={getValue} />
                    </div>
                    {notFound && (
                        <div className="no-actions-found">
                            <svg
                                className="no-actions-icon-found"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1024 1024"
                            >
                                <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 
                                0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 
                                0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 
                                637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 
                                628.5c3.1 3.1 8.2 3.1 11.3 0l275.4-275.3c3.1-3.1 
                                3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 0 0-11.3 
                                0l-230 229.9L461.4 404a8.03 8.03 0 0 0-11.3 
                                0L266.3 586.7a8.03 8.03 0 0 0 0 11.3l39.5 39.7z" />
                            </svg>
                            <p>{lastSearch} not found</p>
                        </div>
                    )}
                    {!notFound && (
                        <div className="cards-divspace">
                            {symbols.map((sym) => {
                                const data = MOCK[sym];
                                const changeAbs = data.last - data.prevClose;
                                const changePct = data.prevClose
                                    ? (changeAbs / data.prevClose) * 100
                                    : 0;

                                const sign =
                                    changeAbs > 0 ? "+" : changeAbs < 0 ? "-" : "";
                                const amountText = `${sign}${Math.abs(changeAbs).toFixed(2)}`;
                                const pctText = `(${sign}${Math.abs(changePct).toFixed(2)}%)`;
                                const trend =
                                    changeAbs > 0
                                        ? "up"
                                        : changeAbs < 0
                                        ? "down"
                                        : "neutral";

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
                    )}
                </div>
            </div>
        </>
    );
}
