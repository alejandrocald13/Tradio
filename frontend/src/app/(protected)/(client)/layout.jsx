"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

export default function ClientLayout({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/auth/check`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setAllowed(false);
          return;
        }

        const data = await res.json();
        if (data.status !== 2 || data.user?.is_superuser) {
          setAllowed(false);
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.error("Client check failed:", err);
        setAllowed(false);
      }
    };

    check();
  }, []);

  if (allowed === null) return null;
  if (allowed === false) return notFound();

  return <>{children}</>;
}
