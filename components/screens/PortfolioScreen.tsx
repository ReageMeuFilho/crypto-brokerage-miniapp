"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { formatCurrency, formatPercent, getPnLColorClass } from "@/lib/utils";
import { Position, Portfolio } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [portfolioRes, positionsRes] = await Promise.all([
          fetch("/api/portfolio"),
          fetch("/api/positions"),
        ]);

        const portfolioData = await portfolioRes.json();
        const positionsData = await positionsRes.json();

        setPortfolio(portfolioData);
        setPositions(positionsData);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const chartData = positions.map((pos) => ({
    name: pos.symbol,
    value: pos.value,
  }));

  return (
    <div className="pb-20">
      {/* Portfolio Summary */}
      <Card className="m-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Total Value
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {formatCurrency(portfolio?.totalValue || 0)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total P&L
            </div>
            <div
              className={`font-semibold ${getPnLColorClass(
                portfolio?.totalPnL || 0
              )}`}
            >
              {portfolio?.totalPnL && portfolio.totalPnL >= 0 ? "+" : ""}
              {formatCurrency(portfolio?.totalPnL || 0)}
            </div>
            <div
              className={`text-sm ${getPnLColorClass(
                portfolio?.totalPnLPercent || 0
              )}`}
            >
              {formatPercent(portfolio?.totalPnLPercent || 0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Cash Balance
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(portfolio?.cashBalance || 0)}
            </div>
          </div>
        </div>
      </Card>

      {/* Allocation Chart */}
      {positions.length > 0 && (
        <Card className="m-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Allocation
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {positions.map((pos, index) => (
              <div key={pos.symbol} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {pos.symbol} ({pos.allocation.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Positions */}
      <div className="m-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Positions
        </h2>
        {positions.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No positions yet
            </div>
          </Card>
        ) : (
          <Card padding="none">
            {positions.map((position, index) => (
              <div key={position.symbol}>
                {index > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {position.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {position.amount} @ {formatCurrency(position.averagePrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(position.value)}
                      </div>
                      <div
                        className={`text-sm ${getPnLColorClass(
                          position.unrealizedPnL
                        )}`}
                      >
                        {position.unrealizedPnL >= 0 ? "+" : ""}
                        {formatCurrency(position.unrealizedPnL)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Current: {formatCurrency(position.currentPrice)}
                    </span>
                    <span
                      className={getPnLColorClass(position.unrealizedPnLPercent)}
                    >
                      {formatPercent(position.unrealizedPnLPercent)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

