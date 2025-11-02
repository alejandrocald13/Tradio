"use client";

import { useEffect, useState } from "react";
import SidebarNav from "../components/SidebarNav-Auth";
import BigChart from "../components/BigChart"
import ActionPortfolio from "../components/ActionPortfolio";
import Modal from "../components/Modal";
import Link from "next/link";
import { api } from "../lib/axios";
import './authHome.css'


export default function AuthHome() {

    const [portfolioActions, setPortfolioActions] = useState([]);

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const { data } = await api.get("/portfolios/");
                setPortfolioActions(data);
            } catch (err) {
                console.error("Portfolio fetch error:", err);
            }
        };

        fetchPortfolio();
    }, []);

    // se calculara el rango de fechas actual, o sea, de que el dia en elq ue estamoos hasta el primero del mes
    const getCurrentMonthRange = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = now;
        // las imprime asi startDate: '2025-10-01', endDate: '2025-10-20' (salio del console log)
        const from = start.toISOString().split("T")[0];
        const to = end.toISOString().split("T")[0];
        return { from, to };
    };

    const handleMonthlyReport = async () => {
        try {
            const { from, to } = getCurrentMonthRange();

            await api.post("/reports/", {
                from,
                to
            });

            setSuccessModalOpen(true);
        } catch (err) {
            console.error("Monthly report error:", err);
            setErrorModalOpen(true);
        }
    };

    const getLast15DaysRange = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 15);
        return {
            from: start.toISOString().split("T")[0],
            to: end.toISOString().split("T")[0],
        };
    };

    const [historyLabels, setHistoryLabels] = useState([]);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { from, to } = getLast15DaysRange();

                const purchasesRes = await api.get("/transactions/purchases/");
                const salesRes = await api.get("/transactions/sales/");

                const purchases = purchasesRes.data;
                const sales = salesRes.data;

                const isWithinRange = (date) => {
                    const formatted = new Date(date).toISOString().split("T")[0];
                    return formatted >= from && formatted <= to;
                };

                const recentPurchases = purchases.filter(p => isWithinRange(p.date));
                const recentSales = sales.filter(s => isWithinRange(s.date));

                const cashOut = recentPurchases.map(p => ({
                    date: p.date.split("T")[0],
                    amount: -(Number(p.quantity) * Number(p.unit_price)),
                }));

                const cashIn = recentSales.map(s => ({
                    date: s.date.split("T")[0],
                    amount: Number(s.quantity) * Number(s.unit_price),
                }));

                const allMovements = [...cashOut, ...cashIn];

                const dailyNetFlow = {};
                allMovements.forEach(({ date, amount }) => {
                    dailyNetFlow[date] = (dailyNetFlow[date] || 0) + amount;
                });

                const sortedDates = Object.keys(dailyNetFlow).sort();
                const sortedValues = sortedDates.map(date => dailyNetFlow[date]);

                if (sortedDates.length === 1) {
                    sortedValues.unshift(sortedValues[0]);
                    sortedDates.unshift("");
                }

                setHistoryLabels(sortedDates);
                setHistoryData(sortedValues);

            } catch (err) {
                console.error("Error fetching history:", err);
            }
        };

        fetchHistory();
    }, []);


    return (

        <>
            <SidebarNav/>

            <div className="general-auth-home">

                <div className="greetings-auth-home">
                    <h1>Welcome back</h1>
                </div>

                <div className="container-home-auth ">

                    <div className="div-container-graph-access">
                        <div className="graph-wallet">
                            <div className="graph-wallet-header">
                                <h3>Fortnightly balance</h3>

                                <div className="legend-authHome">
                                    <span className="legend-dot green"></span> Money In (Sales)
                                    <span className="legend-dot red"></span> Money Out (Purchases)
                                </div>
                            </div>
                            <div className={`graph-wallet-content ${ historyData.length > 0 ? "with-chart" : "empty" }`}>
                                {historyData.length > 0 ? (
                                    <BigChart
                                        chartKey="portfolio-balance-history"
                                        data={historyData}
                                        labels={historyLabels}
                                        refLine={0}
                                        height={385}
                                    />
                                ) : (<div className="empty-state-auth">
                                        <svg
                                            className="empty-state-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 1024 1024"
                                        >
                                            <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 
                                            8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 
                                            0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 0 0-11.3 0L266.3 
                                            586.7a8.03 8.03 0 0 0 0 11.3l39.5 39.7z" />
                                        </svg>

                                        <h4>No balance data yet</h4>
                                        <p className="empty-state-text">
                                            You don’t have any transactions to display for the last 15 days.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="direct-access">
                            <h3>Direct Access</h3>
                            <div className="container-new-access">
                                <button onClick={handleMonthlyReport} className="button-link">
                                    <p><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" strokeWidth="2" d="M6,16 L16,16 L6,16 L6,16 Z M6,12 L18,12 L6,12 L6,12 Z M6,8 L11,8 L6,8 L6,8 Z M14,1 L14,8 L21,8 M3,23 L3,1 L15,1 L21,7 L21,23 L3,23 Z"></path></svg></p>
                                    <p>Monthly report</p>
                                </button>
                                <Link href="/purchases-sales" className="button-link">
                                    <p>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 0 0-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zm-180 0H238c-13 0-24.8 7.9-29.7 20L136 643.2V256h188.5l119.6 114.4H748V444z"></path>
                                        </svg>
                                    </p>
                                    <p>History</p>
                                </Link>
                            </div>
                        </div>

                    </div>

                    <div className="div-container-actions-portfolio">

                        <div className="container-all-actions-portfolio">
                            <h3>Some of your actions</h3>
                            <div className="portfolio-actions">
                                {portfolioActions.length > 0 ? (
                                    portfolioActions.slice(0, 5).map((item, index) => (
                                        <ActionPortfolio
                                            key={index}
                                            data={{
                                                name: item.stock_name,
                                                description: `${item.quantity} shares`,
                                                percentage: item.weight_percentage,
                                                rendimiento: item.performance_percentage
                                            }}
                                        >
                                            <div className="subtitles-authHome">
                                                <p>Portfolio Weight:</p>
                                                {/* <p>Performance:</p> */}
                                            </div>

                                            <div className="data-authHome">
                                                <p>{item.weight_percentage}%</p>
                                                {/* <p>{item.performance_percentage}%</p> */}
                                            </div>
                                        </ActionPortfolio>
                                    ))
                                ) : (
                                    // <p className="no-portfolio-message">No portfolio actions yet.</p>
                                    <div className="empty-portfolio-state">
                                        <svg
                                            className="empty-portfolio-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 1024 1024"
                                        >
                                            <path d="M864 256H160c-35.3 0-64 28.7-64 64v384c0 35.3 28.7 64 64 64h704c35.3 0 64-28.7 64-64V320c0-35.3-28.7-64-64-64zM160 704V320h704v384H160z"/>
                                            <path d="M512 416a96 96 0 1 0 96 96 96.11 96.11 0 0 0-96-96zm0 144a48 48 0 1 1 48-48 48.05 48.05 0 0 1-48 48z"/>
                                        </svg>

                                        <h4>No portfolio actions yet</h4>
                                        <p>Add some actions to see your portfolio summary here.</p>

                                        <Link href="/actions" className="empty-portfolio-btn">
                                            Go check out some actions to buy.
                                        </Link>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={successModalOpen} title="Report Sent" onClose={() => setSuccessModalOpen(false)}>
                <p className="modal-message-authHome">
                    The monthly report has been successfully sent to your email.
                </p>
                <div className="modal-actions-authHome">
                    <button className="btn-modal-primary-authHome" onClick={() => setSuccessModalOpen(false)}>
                        Close
                    </button>
                </div>
            </Modal>

            <Modal isOpen={errorModalOpen} title="Error Sending Report" onClose={() => setErrorModalOpen(false)}>
                <p className="modal-message-authHome">
                    There was an issue sending the report. Please try again.
                </p>
                <div className="modal-actions-authHome">
                    <button className="btn-modal-primary-authHome" onClick={() => setErrorModalOpen(false)}>
                        Close
                    </button>
                </div>
            </Modal>
        </>

    )

}
