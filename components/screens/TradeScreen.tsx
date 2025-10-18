"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Search } from "lucide-react";
import Link from "next/link";

export function TradeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const popularAssets = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
  ];

  return (
    <div className="pb-20">
      {/* Search */}
      <div className="m-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search asset to trade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Popular Assets */}
      <div className="m-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Popular Assets
        </h2>
        <div className="space-y-3">
          {popularAssets.map((asset) => (
            <Link key={asset.symbol} href={`/asset/${asset.symbol}`}>
              <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {asset.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {asset.symbol}
                      </div>
                    </div>
                  </div>
                  <Button variant="primary" size="sm">
                    Trade
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Browse All */}
      <div className="m-4">
        <Link href="/markets">
          <Button variant="outline" fullWidth>
            Browse All Markets
          </Button>
        </Link>
      </div>
    </div>
  );
}

