"use client";

import { useRouter } from "next/navigation";
import Searcher from "./Searcher";
import ActionDetails from "./ActionDetails";
import { MOCK, TAB_ORDER } from "../data/mockQuotes";
import "../actions/[symbol]/actionSymbol.css";
import "../styles/sharedActionDetail.css";

export default function SharedActionDetail({ symbol, showSidebar = false, SidebarComponent = null, isPublic = false, }) {
    const router = useRouter();
    const symbols = Object.keys(MOCK);
    const data_details = MOCK[symbol];
    const name_action = data_details ? data_details.name : "Unknown";

    const getValue = (value) => {
        if (!value) return;
        const searchTerm = value.trim().toUpperCase();
        const foundSymbol = symbols.find((sym) => sym.toUpperCase() === searchTerm);
        const basePath = isPublic ? "/landing/actions" : "/actions";
        const targetSymbol = foundSymbol || value.trim().toUpperCase();
        router.push(`${basePath}/${targetSymbol}`);
    };

    const displaySymbol = symbol ? symbol.toUpperCase() : "Unknown";

    if (!data_details) {
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
                        price={`${data_details.last.toFixed(2)}`}
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
