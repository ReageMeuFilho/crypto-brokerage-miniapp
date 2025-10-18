import { Market } from "@/lib/types";
import { formatCurrency, formatPercent, getPnLColorClass } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MiniSparkline } from "./MiniSparkline";

interface MarketItemProps {
  market: Market;
  onClick?: () => void;
}

export function MarketItem({ market, onClick }: MarketItemProps) {
  const isPositive = market.changePercent24h >= 0;

  return (
    <div
      className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Icon/Symbol */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {market.symbol.slice(0, 2)}
      </div>

      {/* Name and Symbol */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 dark:text-white truncate">
          {market.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {market.symbol}
        </div>
      </div>

      {/* Sparkline */}
      <div className="hidden sm:block w-20 h-10">
        <MiniSparkline data={market.sparkline} isPositive={isPositive} />
      </div>

      {/* Price and Change */}
      <div className="text-right">
        <div className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(market.price)}
        </div>
        <div className={`text-sm flex items-center gap-1 justify-end ${getPnLColorClass(market.changePercent24h)}`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {formatPercent(market.changePercent24h)}
        </div>
      </div>
    </div>
  );
}

