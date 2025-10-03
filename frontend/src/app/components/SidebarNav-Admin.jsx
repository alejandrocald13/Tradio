"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import "../styles/SidebarNav-Admin.css";




export default function SidebarNavAdmin() {
    const pathname = usePathname();

    const items = [
        { id: "users",          label: "Users",         href: "/users" },
        { id: "transaction",    label: "Transaction",   href: "/transaction" },
        { id: "actions",        label: "Actions",       href: "/actionsManage" },
    ];

    const logoutItem = { id: "logout", label: "Logout", href: "/" };

    const DefaultIcons = {
        users: (
        <svg 
        stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 
        17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
        </svg>
        ),
        transaction: (
        <svg 
        stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.79166 2H1V4H4.2184L6.9872 
        16.6776H7V17H20V16.7519L22.1932 7.09095L22.5308 6H6.6552L6.08485 3.38852L5.79166 2ZM19.9869 8H7.092L8.62081 15H18.3978L19.9869 
        8Z" fill="currentColor"></path><path d="M10 22C11.1046 22 12 21.1046 12 20C12 18.8954 11.1046 18 10 18C8.89543 18 8 18.8954 8 
        20C8 21.1046 8.89543 22 10 22Z" fill="currentColor"></path><path d="M19 20C19 21.1046 18.1046 22 17 22C15.8954 22 15 21.1046 15 
        20C15 18.8954 15.8954 18 17 18C18.1046 18 19 18.8954 19 20Z" fill="currentColor"></path>
        </svg>
        ),
        actions: (  
        <svg 
        stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><title></title><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 
        22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 
        14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 
        2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 
        1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 
        1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 
        4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 
        3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"></path>
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

    return (
        <div className={`sidebar ${isCollapsed ? "is-collapsed" : ""}`}>
        <div className="sidebar-panel">
            {items.map((it) => {
            const isActive = isSectionActive(it.href, pathname);
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
            >
            <span className="sidebar-icon">{DefaultIcons[logoutItem.id]}</span>
            <span className="sidebar-label">{logoutItem.label}</span>
            </Link>
        </div>
        </div>
    );
}
