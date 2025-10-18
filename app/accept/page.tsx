"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { parseUnits } from "viem";
import { buildEip681Erc20, generateOrderId, formatCurrency } from "@/lib/utils";
import { Copy, Check, ExternalLink } from "lucide-react";

export default function AcceptPaymentPage() {
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentUri, setPaymentUri] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const merchantAddress = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS || "";
  const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS || "";
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "84532");
  const explorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "";

  useEffect(() => {
    setOrderId(generateOrderId());
  }, []);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      try {
        const amountInWei = parseUnits(amount, 6);
        const uri = buildEip681Erc20(
          usdcAddress,
          merchantAddress,
          amountInWei,
          chainId
        );
        setPaymentUri(uri);
      } catch (error) {
        console.error("Error generating payment URI:", error);
        setPaymentUri("");
      }
    } else {
      setPaymentUri("");
    }
  }, [amount, merchantAddress, usdcAddress, chainId]);

  const handleCopyLink = async () => {
    if (paymentUri) {
      await navigator.clipboard.writeText(paymentUri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMarkAsPaid = () => {
    setIsPaid(true);
    setTimeout(() => {
      setAmount("");
      setOrderId(generateOrderId());
      setIsPaid(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Accept Payment
          </h1>
          <p className="text-gray-600">
            Generate QR code for USDC payment on Base Sepolia
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="12.50"
                className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-600">
              {orderId}
            </div>
          </div>

          {paymentUri && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
                  <QRCodeSVG value={paymentUri} size={256} level="H" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg font-mono text-xs text-gray-600 overflow-x-auto">
                    {paymentUri.substring(0, 50)}...
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleMarkAsPaid}
                  disabled={isPaid}
                  className={`w-full py-4 rounded-xl font-semibold transition-colors ${
                    isPaid
                      ? "bg-green-500 text-white"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {isPaid ? "✓ Payment Confirmed" : "Mark as Paid"}
                </button>

                <a
                  href={`${explorerUrl}/address/${merchantAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  View Balance on Explorer
                </a>
              </div>
            </>
          )}

          {!paymentUri && amount && parseFloat(amount) <= 0 && (
            <div className="text-center py-8 text-gray-500">
              Please enter a valid amount
            </div>
          )}

          {!amount && (
            <div className="text-center py-8 text-gray-400">
              Enter an amount to generate QR code
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Enter the payment amount in USD</li>
            <li>Customer scans QR code with their wallet</li>
            <li>Wallet pre-fills USDC transfer transaction</li>
            <li>Customer confirms and payment settles on Base</li>
            <li>Click &ldquo;Mark as Paid&rdquo; to complete</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
