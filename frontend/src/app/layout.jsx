'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Auth0Provider } from "@auth0/auth0-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_DOMAIN_AUTH0}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID_AUTH0}
        authorizationParams={{
          redirect_uri:
            typeof window !== "undefined"
              ? `${window.location.origin}/landing`
              : "",
        }}
      >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </Auth0Provider>
  );
}
