"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "../styles/SidebarNav-Admin.css";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../lib/axios";

export default function SidebarNavAdmin() {
    const pathname = usePathname();
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

    const items = [
        { id: "homeAdmin",      label: "Home",          href:"/adminHome" },
        { id: "users",          label: "Users" },
        { id: "transactions",    label: "Transactions",   href: "/transaction" },
        { id: "actions",        label: "Actions",       href: "/actionsManage" },
    ];

    const logoutItem = { id: "logout", label: "Logout", href: "/" };

    const DefaultIcons = {
        homeAdmin: (
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path></svg>
        ),
        users: (
        <svg 
        stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 
        17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
        </svg>
        ),
        transactions: (
        <svg 
        stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 0 
        0-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 
        0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 
        512H159l103.3-256h612.4L771.3 768z"></path>
        </svg>
        ),
        actions: (  
        <svg 
        stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 
        8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 
        0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 0 0-11.3 0L266.3 
        586.7a8.03 8.03 0 0 0 0 11.3l39.5 39.7z"></path>
        </svg>
        ),
        logout: (
        <svg 
            stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" 
            xmlns="http://www.w3.org/2000/svg"><path d="M16 13L16 11 7 11 7 8 2 12 7 16 7 13z"></path><path 
            d="M20,3h-9C9.897,3,9,3.897,9,5v4h2V5h9v14h-9v-4H9v4c0,1.103,0.897,2,2,2h9c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z"></path>
        </svg>
        ),
    };  

    // Acá se detecta si se accede a actionsManage para que la Sidebar se haga pequeña
    const isSectionActive = (href, path) =>
    !!path && (path === href || path.startsWith(href + "/"));

    const isCollapsed = (pathname === "/actionsManage");

    // Hace que se quede activa la pesataña en lugar de guardarse (o sea el boton ese que se depliega)
    // queda abajo mostrando que se selecciono 
    // si no se a seleciionado algun tipo de user se guarda el desplegable
    useEffect(() => {
        if (pathname.startsWith("/userClient") || pathname.startsWith("/userAdmin")) {
            setIsUsersOpen(true);
        }
        if (pathname.startsWith("/movements") || pathname.startsWith("/transaction")) {
            setIsTransactionsOpen(true);
        }
    }, [pathname]);
    
    const {
        logout
    } = useAuth0();

    async function LogOutWithAuth0(){
        try {
        const response = await api.post("auth/logout/")
        
        logout({ logoutParams: { returnTo: window.location.origin } });

        } catch (error) {
        console.error("No se pudo terminar sesión correctamente.", error)
        }
    }
    return (
        <div className={`sidebar ${isCollapsed ? "is-collapsed" : ""}`}>
            <div className="sidebar-panel">
                {items.map((it) => {
                const isActive = isSectionActive(it.href, pathname);

                if (it.id === "users") {
                    const userSectionActive =
                        pathname.startsWith("/userClient") || pathname.startsWith("/userAdmin");

                    return (
                        <div key={it.id} className="sidebar-dropdown">
                            <button className={`sidebar-item ${ userSectionActive ? "is-active" : "" }`}
                                onClick={() => setIsUsersOpen(!isUsersOpen)}
                            >
                                <span className="sidebar-item-leftBar" />
                                <span className="sidebar-icon">{DefaultIcons[it.id]}</span>
                                <span className="sidebar-label">{it.label}</span>
                            </button>

                            {isUsersOpen && (
                                <div className="sidebar-submenu">
                                    <Link href="/userClient" className={`sidebar-subitem ${
                                            pathname === "/userClient" ? "active" : ""
                                        }`}
                                    >
                                        Clients
                                    </Link>
                                    {/* <Link href="/userAdmin" className={`sidebar-subitem ${
                                            pathname === "/userAdmin" ? "active" : ""
                                        }`}
                                    >
                                        Admins
                                    </Link> */}
                                </div>
                            )}
                        </div>
                    );
                }

                if (it.id === "transactions") {
                    const transactionSectionActive =
                        pathname.startsWith("/movements") || pathname.startsWith("/transaction");

                    return (
                        <div key={it.id} className="sidebar-dropdown">
                            <button
                                className={`sidebar-item ${transactionSectionActive ? "is-active" : ""}`}
                                onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}
                            >
                                <span className="sidebar-item-leftBar" />
                                <span className="sidebar-icon">{DefaultIcons[it.id]}</span>
                                <span className="sidebar-label">{it.label}</span>
                            </button>

                            {isTransactionsOpen && (
                                <div className="sidebar-submenu">
                                    <Link
                                        href="/movements"
                                        className={`sidebar-subitem ${pathname === "/movements" ? "active" : ""}`}
                                    >
                                        Movements
                                    </Link>
                                    <Link
                                        href="/transaction"
                                        className={`sidebar-subitem ${pathname === "/transaction" ? "active" : ""}`}
                                    >
                                        Transactions
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <Link
                        key={it.id}
                        href={it.href}
                        className={`sidebar-item ${isActive ? "is-active" : ""}`}
                        title={it.label} aria-label={it.label}
                    >
                        <span className="sidebar-item-leftBar" />
                        <span className="sidebar-icon">{DefaultIcons[it.id]}</span>
                        <span className="sidebar-label">{it.label}</span>
                    </Link>
                );
                })}
            </div>

            <div className="sidebar-logout">
                <Link
                href={logoutItem.href}
                className="sidebar-item logout-item"
                title={logoutItem.label} aria-label={logoutItem.label}
                onClick={() => {
                    LogOutWithAuth0()
                }}
                >
                <span className="sidebar-icon">{DefaultIcons[logoutItem.id]}</span>
                <span className="sidebar-label">{logoutItem.label}</span>
                </Link>
            </div>
        </div>
    );
}
