"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { formatCurrency, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { Order, HistoryEntry } from "@/lib/types";
import { Button } from "../ui/Button";

export function ActivityScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "history">("orders");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, historyRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/history"),
        ]);

        const ordersData = await ordersRes.json();
        const historyData = await historyRes.json();

        setOrders(ordersData);
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await fetch(`/api/orders?id=${orderId}`, { method: "DELETE" });
      // Refresh orders
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="m-4">
        {activeTab === "orders" ? (
          orders.length === 0 ? (
            <Card>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No active orders
              </div>
            </Card>
          ) : (
            <Card padding="none">
              {orders.map((order, index) => (
                <div key={order.id}>
                  {index > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {order.side === "buy" ? "Buy" : "Sell"} {order.symbol}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.type.charAt(0).toUpperCase() + order.type.slice(1)} •{" "}
                          {order.amount}{" "}
                          {order.price && `@ ${formatCurrency(order.price)}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium px-2 py-1 rounded ${
                            order.status === "filled"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : order.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          )
        ) : history.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No transaction history
            </div>
          </Card>
        ) : (
          <Card padding="none">
            {history.map((entry, index) => (
              <div key={entry.id}>
                {index > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {entry.type === "trade"
                          ? `Trade ${entry.symbol}`
                          : entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </div>
                      {entry.symbol && entry.price && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.amount} @ {formatCurrency(entry.price)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(entry.total)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(entry.timestamp)}
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

