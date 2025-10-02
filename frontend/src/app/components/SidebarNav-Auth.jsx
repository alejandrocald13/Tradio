"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import "../styles/SidebarNav-Auth.css";




export default function SidebarNav() {
  const pathname = usePathname();

  const items = [
  // { id: "profile",   label: "Profile",         href: "/profile" },
  { id: "wallet",    label: "Wallet",          href: "/wallet" },
  { id: "actions",   label: "Actions",         href: "/actions" },
  // { id: "purchases", label: "Purchases/Sales", href: "/purchases-sales" },
  { id: "referrals", label: "Referrals",       href: "/referrals" },
  { id: "portfolio", label: "Portfolio",       href: "/portfolio" },
  ];

  const logoutItem = { id: "logout", label: "Logout", href: "/" };

  const DefaultIcons = {
    profile: (
      <svg 
      stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" 
      xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 
      100-6 3 3 0 000 6z" clipRule="evenodd"></path>
      </svg>
    ),
    purchases: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
        <path d="M4 16V4H2V2h3a1 1 0 0 1 1 1v12h12.438l2-8H8V5h13.72a1 1 0 0 1 .97 1.243l-2.5 10a1 1 0 0 1-.97.757H5a1 1 0 0 1-1-1zm2 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
      </svg>
    ),
    referrals: (
      <svg 
        stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 
        1h8zm-7.995-.944v-.002.002zM7.022 13h7.956a.274.274 0 00.014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 
        10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 00.022.004zm7.973.056v-.002.002zM11 
        7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zM6.936 9.28a5.88 5.88 0 00-1.23-.247A7.35 7.35 0 005 9c-4 0-5 3-5 4 
        0 .667.333 1 1 1h4.216A2.238 2.238 0 015 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 
        1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 116 0 3 3 0 01-6 0zm3-2a2 2 0 100 4 2 2 0 000-4z" 
        clipRule="evenodd"></path>
      </svg>
    ),
    actions: (  
      <svg 
        stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" 
        d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clipRule="evenodd"></path>
        <path fillRule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clipRule="evenodd"></path>
      </svg>

    ),
    wallet: (
      <svg 
        stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path d="M16 12H18V16H16z"></path>
        <path d="M20,7V5c0-1.103-0.897-2-2-2H5C3.346,3,2,4.346,2,6v12c0,2.201,1.794,3,3,3h15c1.103,0,2-0.897,2-2V9 
        C22,7.897,21.103,7,20,7z M5,5h13v2H5C4.448,7,4,6.551,4,6S4.448,5,5,5z M20,19H5.012C4.55,18.988,4,18.805,4,18V8.815 
        C4.314,8.928,4.647,9,5,9h15V19z"></path>
      </svg>
    ),
    portfolio: (
      <svg 
        stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4H11V2.5l-.5-.5h-5l-.5.5V4H1.5l-.5.5v8l.5.5h13l.5-.5v-8l-.5-.5zM6 
        3h4v1H6V3zm8 2v.76L10 8v-.5L9.51 7h-3L6 7.5V8L2 5.71V5h12zM9 8v1H7V8h2zm-7 4V6.86l4 2.29v.35l.5.5h3l.5-.5v-.31l4-2.28V12H2z"></path>
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

  // Acá se detecta si en las acciones hay un tushito mas (/NFLX o cualquier otro), para activar el boton
  // y para que la barra se haga mas pequeña de la normal
  const isSectionActive = (href, path) => {
    if (!path) return false;
    if (href === "/") return path === "/";
    return path === href || path.startsWith(href + "/");
  };

  const isCollapsed  = pathname?.startsWith("/actions/");

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
