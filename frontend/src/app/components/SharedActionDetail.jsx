"use client";

import { useRouter } from "next/navigation";
import Searcher from "./Searcher";
import ActionDetails from "./ActionDetails";
import { MOCK, TAB_ORDER } from "../data/mockQuotes";
import "../actions/[symbol]/actionSymbol.css";

export default function SharedActionDetail({ symbol, showSidebar = false, SidebarComponent = null, isPublic = false, }) {
    const router = useRouter();
    const symbols = Object.keys(MOCK);
    const data_details = MOCK[symbol];
    const name_action = data_details ? data_details.name : "Unknown";

    const getValue = (value) => {
        if (!value) return;
        const searchTerm = value.trim().toUpperCase();
        const foundSymbol = symbols.find((sym) => sym.toUpperCase() === searchTerm);
        if (foundSymbol) router.push(`/actions/${foundSymbol}`);
        else alert("No stock with that symbol was found");
    };

    if (!data_details) {
        return (
        <>
            {showSidebar && SidebarComponent && <SidebarComponent />}
            <div className="global-container">
            <div className="container-detail">
                <div className="search-detail-wrapper">
                <Searcher placeholderI="Search by symbol" getValue={getValue} />
                </div>
                <div className="no-data">Sin datos para {symbol}</div>
            </div>
            </div>
        </>
        );
    }

    const dataByTab = Object.fromEntries(
        Object.entries(data_details.tabs).map(([time, data_show]) => [
        time,
        {
            data: data_show.data.map(Number),
            labels: data_show.labels.map(String),
            ref: typeof data_show.ref === "number" ? data_show.ref : undefined,
        },
        ])
    );

    const tabs = TAB_ORDER.filter((t) => t in dataByTab);
    const changeAbs = data_details.last - data_details.prevClose;
    const changePct = (changeAbs / data_details.prevClose) * 100;
    const changePrice = changeAbs > 0 ? "up" : changeAbs < 0 ? "down" : "neutral";

    return (
        <>
            {showSidebar && SidebarComponent && <SidebarComponent />}

            <div className={`global-container ${isPublic ? "public-view" : "private-view"}`}>
                <div className="container-detail">
                <div className="search-detail-wrapper">
                    <Searcher placeholderI="Search by symbol" getValue={getValue} />
                </div>

                <ActionDetails
                    subtitle="Nasdaq GIDS · Delayed Quote"
                    title={name_action}
                    price={`$${data_details.last.toFixed(2)}`}
                    change={`${changeAbs >= 0 ? "+" : ""}${changeAbs.toFixed(2)} (${changePct.toFixed(2)}%)`}
                    changeTone={changePrice}
                    tabs={tabs}
                    dataByTab={dataByTab}
                    isPublic={isPublic} 
                />
                </div>
            </div>
        </>
    );
}
