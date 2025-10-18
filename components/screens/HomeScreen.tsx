"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { MarketItem } from "../ui/MarketItem";
import { PortfolioCard } from "../ui/PortfolioCard";
import { FloatingActionButton } from "../ui/FloatingActionButton";
import { formatCurrency, formatPercent, getPnLColorClass } from "@/lib/utils";
import { Market, Portfolio } from "@/lib/types";
import { 
  TrendingUp, 
  Eye, 
  EyeOff, 
  ShoppingCart, 
  DollarSign, 
  ArrowLeftRight, 
  Send, 
  Download 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HomeScreen() {
  const router = useRouter();
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
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Portfolio Value Card */}
      <div className="p-4">
        {portfolio ? (
          <PortfolioCard
            totalValue={portfolio.totalValue}
            dailyChange={portfolio.dayPnL}
            dailyChangePercent={portfolio.dayPnLPercent}
          />
        ) : (
          <Card>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </Card>
        )}
      </div>

      {/* Asset Info Card */}
      {portfolio && (
        <div className="mx-4 mb-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ethereum
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ETH
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  $3,245.67
                </div>
                <div className="text-xs text-success-600 dark:text-success-400">
                  +2.45%
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/trade" className="block">
                <button className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
                  Buy ETH
                </button>
              </Link>
              <Link href="/trade" className="block">
                <button className="w-full h-12 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors">
                  Sell ETH
                </button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="mx-4 mb-6">
        <div className="flex items-center justify-between px-2">
          <FloatingActionButton
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Buy"
            variant="success"
            onClick={() => router.push("/trade")}
          />
          <FloatingActionButton
            icon={<DollarSign className="w-5 h-5" />}
            label="Sell"
            variant="error"
            onClick={() => router.push("/trade")}
          />
          <FloatingActionButton
            icon={<ArrowLeftRight className="w-5 h-5" />}
            label="Swap"
            variant="neutral"
            onClick={() => router.push("/trade")}
          />
          <FloatingActionButton
            icon={<Send className="w-5 h-5" />}
            label="Send"
            variant="neutral"
            onClick={() => router.push("/portfolio")}
          />
          <FloatingActionButton
            icon={<Download className="w-5 h-5" />}
            label="Receive"
            variant="neutral"
            onClick={() => router.push("/portfolio")}
          />
        </div>
      </div>

      {/* Market Overview */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Market Overview
          </h2>
          <Link
            href="/markets"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            View All
          </Link>
        </div>
        <Card padding="none" className="shadow-soft">
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
    </div>
  );
}

