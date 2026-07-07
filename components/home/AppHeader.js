"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

import BrandLogo from "@/components/brand/BrandLogo";

export default function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthenticated(isAuthenticated());
  }, []);

  return (
    <header className="club-header">
      <BrandLogo href="/" size="md" priority />

      <div className="club-header-actions">
        {mounted && authenticated ? (
          <Link href="/wallet" className="club-btn-wallet">
            <span className="club-btn-wallet-icon" aria-hidden="true">
              👛
            </span>
            Wallet
          </Link>
        ) : (
          <>
            <Link href="/login" className="club-btn-outline">
              Login
            </Link>
            <Link href="/register" className="club-btn-gradient">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
