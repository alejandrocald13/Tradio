"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Searcher from "./Searcher";
import ActionDetails from "./ActionDetails";
import { api } from "@/app/lib/axios";
import "../actions/[symbol]/actionSymbol.css";
import "../styles/sharedActionDetail.css";

export default function SharedActionDetail({ symbol, showSidebar = false, SidebarComponent = null, isPublic = false }) {
    const TAB_CONFIG = {
        "1D": { days: 1, interval: "1d" },
        "5D": { days: 5, interval: "1d" },
        "1M": { days: 30, interval: "1d" },
        "6M": { days: 180, interval: "1wk" },
        "1Y": { days: 365, interval: "1wk" },
        "5Y": { days: 1825, interval: "1mo" },
    };

    const router = useRouter();
    const [tab, setTab] = useState("1D");
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const lastTyped = useRef("");

    const getValue = (value) => {
        const cleaned = value.trim().toUpperCase();
        if (cleaned !== "") {
            lastTyped.current = cleaned;
            return;
        }
        if (lastTyped.current.length >= 2) {
            router.push(`/actions/${lastTyped.current}`);
        }
        lastTyped.current = "";
    };

    useEffect(() => {
        const fetchStockHistory = async () => {
            setLoading(true);
            setNotFound(false);

            try {
                const { days, interval } = TAB_CONFIG[tab];
                const { data } = await api.get("/stocks-history/history/", { params: { symbol, days, interval }});
                const raw = data.data;
                const points = Array.isArray(raw) ? raw[0] : raw;

                if (!points || !points.c || !points.t) {
                    setNotFound(true);
                    setStock(null);
                    setLoading(false);
                    return;
                }

                const values = points.c;
                const labels = points.t.map((ts) => new Date(ts * 1000).toLocaleDateString());
                const first = values[0];
                const last = values[values.length - 1];
                const changeAbs = last - first;
                const changePct = (changeAbs / first) * 100;

                setStock({
                    name: data.stock,
                    price: last,
                    changeAbs,
                    changePct,
                    changeTone: changeAbs > 0 ? "up" : changeAbs < 0 ? "down" : "neutral",
                    dataByTab: {
                        [tab]: { data: values, labels, ref: first },
                    },
                });
            } catch {
                setNotFound(true);
                setStock(null);
            }

            setLoading(false);
        };

        fetchStockHistory();
    }, [symbol, tab]);

    const tabs = Object.keys(TAB_CONFIG);

    if (!loading && (notFound || !stock)) {
        const displaySymbol = symbol ? symbol.toUpperCase() : "Unknown";
        return (
            <>
                {showSidebar && SidebarComponent && <SidebarComponent />}

                <div className="global-container">
                    <div className="container-detail">
                        <div className="search-detail-wrapper">
                            <Searcher placeholderI="Search by symbol" getValue={getValue} />
                        </div>

                        <div className={`no-actions-found ${showSidebar ? "with-sidebar" : "no-sidebar"}`}>
                            <svg
                                className="no-actions-icon-found"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1024 1024"
                            >
                                <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 
                                8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 
                                0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 0 0-11.3 0L266.3 
                                586.7a8.03 8.03 0 0 0 0 11.3l39.5 39.7z" />
                            </svg>
                            <p>{displaySymbol} not found</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {showSidebar && SidebarComponent && <SidebarComponent />}

            <div className={`global-container ${isPublic ? "public-view" : "private-view"}`}>
                <div className="container-detail">
                    <div className="search-detail-wrapper">
                        <Searcher placeholderI="Search by symbol" getValue={getValue} />
                    </div>

                    {stock && (
                        <ActionDetails
                            subtitle="Market Data"
                            title={stock.name}
                            price={stock.price.toFixed(2)}
                            change={`${stock.changeAbs >= 0 ? "+" : ""}${stock.changeAbs.toFixed(2)} (${stock.changePct.toFixed(2)}%)`}
                            changeTone={stock.changeTone}
                            tabs={tabs}
                            dataByTab={stock.dataByTab}
                            isPublic={isPublic}
                            currentTab={tab}
                            onTabChange={setTab}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
