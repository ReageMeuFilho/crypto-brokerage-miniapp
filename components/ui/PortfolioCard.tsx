import { formatCurrency, formatPercent, getPnLColorClass } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PortfolioCardProps {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export function PortfolioCard({
  totalValue,
  dailyChange,
  dailyChangePercent,
}: PortfolioCardProps) {
  const isPositive = dailyChange >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-6 shadow-soft-lg">
      <div className="relative z-10">
        <div className="text-sm font-medium text-white/80 mb-1">
          Portfolio Value
        </div>
        <div className="text-4xl font-bold text-white mb-3">
          {formatCurrency(totalValue)}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? "text-success-100" : "text-error-100"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {formatCurrency(dailyChange)}
            </span>
            <span>({formatPercent(dailyChangePercent)})</span>
          </div>
          <span className="text-xs text-white/60">24h</span>
        </div>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
    </div>
  );
}
