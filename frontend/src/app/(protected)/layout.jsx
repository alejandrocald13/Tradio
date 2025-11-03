"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/auth/check`, { cache: "no-store" });
        console.log("HOLA DESDE LAYAOU", res)

        if (!res.ok) {
          setIsAuthorized(false);
          return;
        }

        const data = await res.json();

        if (data.status !== 2 || !data.user) {
          setIsAuthorized(false);
          return;
        }

        const isAdmin = data.user.is_superuser;
        const path = window.location.pathname;

        if (path.startsWith("/adminHome") && !isAdmin) {
          setIsAuthorized(false);
          return;
        }

        if (path.startsWith("/authHome") && isAdmin) {
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthorized === false) return notFound();
  if (isAuthorized === null) return null;

  return <>{children}</>
}