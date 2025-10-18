"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { MarketItem } from "../ui/MarketItem";
import { formatCurrency, formatPercent, getPnLColorClass } from "@/lib/utils";
import { Market, Portfolio } from "@/lib/types";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function HomeScreen() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [topMovers, setTopMovers] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [portfolioRes, marketsRes] = await Promise.all([
          fetch("/api/portfolio"),
          fetch("/api/markets"),
        ]);

        if (!portfolioRes.ok || !marketsRes.ok) {
          console.error("Authentication required or API error");
          setAuthError(true);
          setLoading(false);
          return;
        }

        const portfolioData = await portfolioRes.json();
        const marketsData = await marketsRes.json();

        if (Array.isArray(marketsData)) {
          setPortfolio(portfolioData);
          // Get top 3 movers by absolute change percentage
          const sorted = [...marketsData].sort(
            (a, b) => Math.abs(b.changePercent24h) - Math.abs(a.changePercent24h)
          );
          setTopMovers(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This app is designed to work within Farcaster. Please access it through the Base app or Warpcast.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            <p className="mb-2">To use this app:</p>
            <ol className="text-left list-decimal list-inside space-y-1">
              <li>Open Warpcast or the Base app</li>
              <li>Find the Crypto Brokerage mini app</li>
              <li>Launch it from within Farcaster</li>
            </ol>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Portfolio Value Card */}
      <Card className="m-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Portfolio Value
          </h2>
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {balanceVisible ? (
              <Eye className="w-4 h-4 text-gray-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {balanceVisible
              ? formatCurrency(portfolio?.totalValue || 0)
              : "••••••"}
          </div>
          {portfolio && (
            <div
              className={`text-sm flex items-center gap-1 mt-1 ${getPnLColorClass(
                portfolio.dayPnL
              )}`}
            >
              <span>
                {balanceVisible
                  ? `${portfolio.dayPnL >= 0 ? "+" : ""}${formatCurrency(
                      portfolio.dayPnL
                    )}`
                  : "••••"}
              </span>
              <span>
                ({balanceVisible ? formatPercent(portfolio.dayPnLPercent) : "••••"})
              </span>
              <span className="text-gray-500">Today</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Cash Balance
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {balanceVisible
                ? formatCurrency(portfolio?.cashBalance || 0)
                : "••••••"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total P&L
            </div>
            <div
              className={`font-semibold ${getPnLColorClass(
                portfolio?.totalPnL || 0
              )}`}
            >
              {balanceVisible
                ? `${portfolio?.totalPnL && portfolio.totalPnL >= 0 ? "+" : ""}${formatCurrency(
                    portfolio?.totalPnL || 0
                  )}`
                : "••••••"}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mx-4 mb-6">
        <Link href="/trade">
          <Card className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              Trade
            </div>
          </Card>
        </Link>
        <Link href="/portfolio">
          <Card className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              Deposit
            </div>
          </Card>
        </Link>
      </div>

      {/* Top Movers */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Movers
          </h2>
          <Link
            href="/markets"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </Link>
        </div>
        <Card padding="none">
          {topMovers.map((market, index) => (
            <div key={market.symbol}>
              {index > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700" />
              )}
              <MarketItem
                market={market}
                onClick={() => (window.location.href = `/asset/${market.symbol}`)}
              />
            </div>
          ))}
        </Card>
      </div>

      {/* Watchlist placeholder */}
      <div className="mx-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Watchlist
          </h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Edit
          </button>
        </div>
        <Card>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="mb-2">Your watchlist is empty</p>
            <Link
              href="/markets"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse markets to add assets
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

