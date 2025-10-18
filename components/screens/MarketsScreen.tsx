"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { MarketItem } from "../ui/MarketItem";
import { Market } from "@/lib/types";
import { Search } from "lucide-react";

export function MarketsScreen() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch("/api/markets");
        const data = await res.json();
        setMarkets(data);
        setFilteredMarkets(data);
      } catch (error) {
        console.error("Error fetching markets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredMarkets(markets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = markets.filter(
      (market) =>
        market.name.toLowerCase().includes(query) ||
        market.symbol.toLowerCase().includes(query)
    );
    setFilteredMarkets(filtered);
  }, [searchQuery, markets]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Search Bar */}
      <div className="sticky top-14 z-30 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Markets List */}
      <div className="m-4">
        <Card padding="none">
          {filteredMarkets.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No markets found
            </div>
          ) : (
            filteredMarkets.map((market, index) => (
              <div key={market.symbol}>
                {index > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                )}
                <MarketItem
                  market={market}
                  onClick={() =>
                    (window.location.href = `/asset/${market.symbol}`)
                  }
                />
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

