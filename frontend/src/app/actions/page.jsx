"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SidebarNav from "../components/SidebarNav-Auth";
import ActionCard from "../components/ActionCard";
import MiniChart from "../components/MiniChart";
import Searcher from "../components/Searcher";
import { api } from "@/app/lib/axios";
import "./actions.css";
import "../styles/sharedActionDetail.css";

export default function Actions() {
    const lastTyped = useRef("");
    const router = useRouter();
    const [stocks, setStocks] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const trendClass = { up: "td-up", down: "td-down", neutral: "td-neutral" };

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const { data } = await api.get("/stocks-history/all_history/");
                setStocks(data.stocks);
                setSymbols(data.stocks.map((s) => s.symbol.toUpperCase())); 
            } catch (error) {
                console.error("Error fetching stocks:", error);
            }
        };
        fetchStocks();
    }, []);

    const getValue = (value) => {
        const cleaned = value.trim().toUpperCase();
        if (cleaned !== "") {
            lastTyped.current = cleaned;
            return;
        }
        if (lastTyped.current.length >= 1) {
            router.push(`/actions/${lastTyped.current}`);
        }
        lastTyped.current = "";
    };

    return (
        <>
            <SidebarNav />
            <div className="page-container">
                <div className="action-container">
                    <div className="search-divspace">
                        <Searcher symbols={symbols} placeholderI="Search by symbol" getValue={getValue} />
                    </div>

                    <div className="cards-divspace">
                        {stocks.map((stock) => {
                            const todayPrices = stock.data.c.map(Number);
                            const last = Number(stock.current_price);
                            const first = todayPrices[0];
                            let changeAbs = last - first;
                            let changePct = (changeAbs / first) * 100;
                            const trend = changeAbs > 0 ? "up" : changeAbs < 0 ? "down" : "neutral";

                            return (
                                <ActionCard
                                    key={stock.symbol}
                                    symbol={stock.symbol}
                                    actionName={stock.name}
                                    price={`$${last.toFixed(2)}`}
                                    changeText={`${changeAbs.toFixed(2)} (${changePct.toFixed(2)}%)`}
                                    variantClass={trendClass[trend]}
                                    graphic={<MiniChart data={todayPrices} />}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}