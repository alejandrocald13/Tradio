"use client";

import SidebarNav from "../components/SidebarNav-Auth";
import BigChart from "../components/BigChart"
import ActionPortfolio from "../components/ActionPortfolio";
import Link from "next/link";
import './authHome.css'




export default function AuthHome() {
    const labels = [
        "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
    ];
    const data = [102, 98, 105, 107, 101, 95, 110];
    const refLine = 100;

    const dataGeneral = [
        {
        name: 'Tesla',
        description: 'Más Rentable',
        percentage: 16,
        rendimiento: +12
        }, {
        name: 'Oracle',
        description: 'Menos Rentable',
        percentage: 20,
        rendimiento: -1.8
        },{
        name: 'Amazon',
        description: 'Mayor Porcentaje',
        percentage: 25,
        rendimiento: +1
        }
        ,{
        name: 'Amazon',
        description: 'Mayor Porcentaje',
        percentage: 25,
        rendimiento: +1
        }
        ,{
        name: 'Amazon',
        description: 'Mayor Porcentaje',
        percentage: 25,
        rendimiento: +1
        }
    ]

    // se calculara el rango de fechas actual, o sea, de que el dia en elq ue estamoos hasta el primero del mes
    const getCurrentMonthRange = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = now;
        const startDate = start.toISOString().split("T")[0];
        const endDate = end.toISOString().split("T")[0];
        // las imprime asi startDate: '2025-10-01', endDate: '2025-10-20' (salio del console log)

        return { startDate, endDate };
    };

    const handleMonthlyReport = () => {
        console.log(getCurrentMonthRange());
    };

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
                            <h3>Weekly balance</h3>
                            <BigChart
                                chartKey="ejemplo"
                                data={data}
                                labels={labels}
                                refLine={refLine}
                                height={385}
                            />      
                        </div>

                        <div className="direct-access">
                            <h3>Direct Access</h3>
                            <div className="container-new-access">
                                <button onClick={handleMonthlyReport}>
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
                                {dataGeneral.map((dat, index) =>(
                                    <ActionPortfolio key={index} data={dat}/>))
                                }
                            </div>
                        </div>

                    </div>


                </div>

            </div>
        </>

    )

}
