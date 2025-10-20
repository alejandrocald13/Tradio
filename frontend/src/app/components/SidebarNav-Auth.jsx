"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import "../styles/SidebarNav-Auth.css";




export default function SidebarNav() {
  const pathname = usePathname();

  const items = [
  { id: "authHome",  label: "Home",            href: "/authHome" },
  { id: "profile",   label: "Profile",         href: "/profile" },
  { id: "wallet",    label: "Wallet",          href: "/wallet" },
  { id: "actions",   label: "Actions",         href: "/actions" },
  { id: "referrals", label: "Referrals",       href: "/referrals" },
  { id: "portfolio", label: "Portfolio",       href: "/portfolio" },
  ];

  const logoutItem = { id: "logout", label: "Logout", href: "/" };

  const DefaultIcons = {
    authHome: (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path></svg>
    ),
    profile: (
      <svg 
        fill="currentColor" 
        stroke="none" 
        viewBox="0 0 24 24" 
        height="1em" width="1em" 
        xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16 9C16 
          11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 
          9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 
          13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 
          7 12 7C13.1046 7 14 7.89543 14 9Z"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.92487 
          1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 
          18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 
          3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 
          12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 
          15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 
          3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 
          18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 
          16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 
          12 21Z"></path>
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
