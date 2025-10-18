"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { TopHeader } from "@/components/layout/TopHeader";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercent, getPnLColorClass } from "@/lib/utils";
import { useIExec } from "@/hooks/use-iexec";
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

interface Quote {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];
}

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params?.symbol as string) || "";

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const { address, isConnected, chain } = useAccount();
  const { submitAndExecuteOrder, isProcessing, error: iexecError } = useIExec();
  const { sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!symbol) {
      setError("No symbol provided");
      setLoading(false);
      return;
    }

    async function fetchQuote() {
      try {
        const res = await fetch(`/api/quotes/${symbol}`);
        if (!res.ok) {
          console.error("Failed to fetch quote", res.status);
          setError(`Failed to fetch quote: ${res.status}`);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setQuote(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching quote:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
    const interval = setInterval(fetchQuote, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [symbol]);

  const handleReviewOrder = () => {
    if (!quantity || (orderType === "limit" && !limitPrice)) {
      alert("Please fill in all required fields");
      return;
    }

    setOrderDetails({
      symbol: quote?.symbol,
      name: quote?.name,
      quantity: parseFloat(quantity),
      price: orderType === "limit" && limitPrice ? parseFloat(limitPrice) : quote?.price,
      total: estimatedTotal,
      side,
      type: orderType,
    });
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (chain?.id !== arbitrumSepolia.id) {
      try {
        await switchChain({ chainId: arbitrumSepolia.id });
      } catch (error) {
        alert("Please switch to Arbitrum Sepolia network");
        return;
      }
    }

    setSubmitting(true);
    try {
      const darkPoolOrder = {
        symbol,
        side,
        amount: parseFloat(quantity),
        price: orderType === "limit" ? parseFloat(limitPrice) : quote?.price,
        timestamp: Date.now(),
      };

      const result = await submitAndExecuteOrder(darkPoolOrder);

      if (result) {
        const { raw_tx, result: orderResult } = result;
        
        const txHash = await sendTransaction({
          to: raw_tx.to as `0x${string}`,
          data: raw_tx.data as `0x${string}`,
          value: BigInt(raw_tx.value),
          gas: BigInt(raw_tx.gasLimit),
        });

        setOrderDetails({
          orderId: orderResult.orderId,
          status: orderResult.status,
          executedPrice: orderResult.executedPrice,
          executedAmount: orderResult.executedAmount,
          txHash,
          symbol: quote?.symbol,
          name: quote?.name,
          quantity: parseFloat(quantity),
          price: orderType === "limit" && limitPrice ? parseFloat(limitPrice) : quote?.price,
          total: estimatedTotal,
          side,
          type: orderType,
        });
        setShowConfirmation(false);
        setShowSuccessModal(true);
        setQuantity("");
        setLimitPrice("");
      } else {
        alert(`Failed to place order: ${iexecError || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(`Failed to place order: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {error ? "Error Loading Asset" : "Asset Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || `The asset ${symbol} could not be found.`}
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const estimatedTotal = quantity
    ? parseFloat(quantity) *
      (orderType === "limit" && limitPrice
        ? parseFloat(limitPrice)
        : quote.price)
    : 0;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {quote.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {quote.symbol}
            </p>
          </div>
        </div>
      </div>

      {/* Price Card */}
      <div className="m-4">
        <Card>
          <div className="mb-4">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(quote.price)}
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${getPnLColorClass(
                quote.change24h
              )}`}
            >
              {quote.change24h >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {quote.change24h >= 0 ? "+" : ""}
                {formatCurrency(quote.change24h)}
              </span>
              <span>({formatPercent(quote.changePercent24h)})</span>
              <span className="text-gray-500">24h</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                24h High
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quote.high24h)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                24h Low
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quote.low24h)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                24h Volume
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quote.volume24h)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Entry */}
      <div className="m-4">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Place Order
          </h2>

          {/* Buy/Sell Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSide("buy")}
              className={`py-3 rounded-lg font-semibold transition-colors ${
                side === "buy"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSide("sell")}
              className={`py-3 rounded-lg font-semibold transition-colors ${
                side === "sell"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              Sell
            </button>
          </div>

          {/* Order Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderType("market")}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  orderType === "market"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType("limit")}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  orderType === "limit"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          {/* Limit Price (only for limit orders) */}
          {orderType === "limit" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Limit Price
              </label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder={formatCurrency(quote.price)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Estimated Total */}
          {quantity && (
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated Total
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            variant={side === "buy" ? "success" : "danger"}
            fullWidth
            onClick={handleReviewOrder}
            disabled={submitting || !quantity}
          >
            {`Review ${side === "buy" ? "Buy" : "Sell"} Order`}
          </Button>
        </Card>
      </div>

      {/* Order Confirmation Screen */}
      {showConfirmation && orderDetails && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="min-h-screen pb-20">
            {/* Top Header with Wallet */}
            <TopHeader title="Confirm Order" showSearch={false} showNotifications={false} />
            
            {/* Back Button */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Order</span>
              </button>
            </div>

            {/* Order Summary */}
            <div className="m-4">
              <Card>
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    You are about to {orderDetails.side}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {orderDetails.quantity} {orderDetails.symbol}
                  </div>
                  <div className="text-xl text-gray-600 dark:text-gray-400">
                    {formatCurrency(orderDetails.total)}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Order Type</span>
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                      {orderDetails.type} {orderDetails.side}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Asset</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {orderDetails.name} ({orderDetails.symbol})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Quantity</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {orderDetails.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Price per {orderDetails.symbol}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(orderDetails.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(orderDetails.total)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Fee Breakdown */}
            <div className="m-4">
              <Card>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Fee Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Trading Fee (0.1%)</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency((orderDetails.total || 0) * 0.001)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Network Fee</span>
                    <span className="text-gray-900 dark:text-white">$0.50</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-semibold">
                    <span className="text-gray-900 dark:text-white">Total Cost</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency((orderDetails.total || 0) + (orderDetails.total || 0) * 0.001 + 0.5)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Terms */}
            <div className="m-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By placing this order, you agree to our Terms of Service and acknowledge that cryptocurrency trading involves risk.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="space-y-2">
                <Button
                  variant={orderDetails.side === "buy" ? "success" : "danger"}
                  fullWidth
                  onClick={handleConfirmOrder}
                  disabled={submitting}
                >
                  {submitting ? "Placing Order..." : `Confirm ${orderDetails.side === "buy" ? "Buy" : "Sell"}`}
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowConfirmation(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderDetails && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Trade Successful!"
          subtitle="Your order has been executed successfully"
          actions={
            <>
              <Button
                variant="primary"
                fullWidth
                onClick={() => router.push("/portfolio")}
              >
                View in Portfolio
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowSuccessModal(false)}
              >
                Make Another Trade
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Trade Details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {orderDetails.side === "buy" ? "Bought" : "Sold"}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderDetails.quantity} {orderDetails.symbol}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(orderDetails.total)}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Trade Type
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {orderDetails.type} {orderDetails.side}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Price per {orderDetails.symbol}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(orderDetails.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span className="font-semibold text-success-600 dark:text-success-400">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SuccessModal>
      )}
    </div>
  );
}
