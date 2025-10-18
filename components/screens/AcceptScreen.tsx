"use client";
import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CHAIN_ID, USDC_DECIMALS, EXPLORER, USDC, MERCHANT } from "@/lib/chain";
import { buildEip681Erc20 } from "@/lib/eip681";
import { formatUnits, parseUnits } from "viem";

export default function AcceptScreen() {
  const [fiat, setFiat] = useState("12.50");
  const [orderId] = useState(() => crypto.randomUUID());
  const amount = useMemo(() => {
    const n = Number(fiat || "0");
    return parseUnits(n.toFixed(6), USDC_DECIMALS);
  }, [fiat]);

  const eip681 = buildEip681Erc20(amount, CHAIN_ID);

  const [tx, setTx] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function checkPaid() {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
    }, 1000);
  }

  function copyLink() {
    navigator.clipboard.writeText(eip681);
    alert("Payment link copied to clipboard!");
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="text-2xl font-semibold">Accept Payment</div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount (USD)</label>
          <input
            value={fiat}
            onChange={(e) => setFiat(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-lg"
            placeholder="12.50"
            inputMode="decimal"
          />
        </div>
        
        <div className="text-sm text-gray-600">
          Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span>
        </div>

        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
          <QRCodeSVG value={eip681} size={240} />
        </div>

        <div className="text-xs text-gray-500 break-all bg-gray-50 p-3 rounded">
          <strong>Payment Link:</strong> {eip681}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button 
            className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition"
            onClick={copyLink}
          >
            Copy Link
          </button>
          <a 
            className="flex-1 bg-gray-100 text-gray-700 rounded-lg px-4 py-3 font-medium hover:bg-gray-200 transition text-center"
            href={`${EXPLORER}/token/${USDC}?a=${MERCHANT}`} 
            target="_blank"
            rel="noopener noreferrer"
          >
            View Merchant Token
          </a>
        </div>

        <button 
          className="w-full bg-green-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-green-700 transition disabled:opacity-50"
          onClick={checkPaid} 
          disabled={checking}
        >
          {checking ? "Checking..." : "Mark as Paid"}
        </button>

        {tx && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="font-medium text-emerald-800 mb-2">✅ PAID</div>
            <a 
              className="text-emerald-600 underline text-sm" 
              href={`${EXPLORER}/tx/${tx}`} 
              target="_blank"
              rel="noopener noreferrer"
            >
              View transaction
            </a>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>How it works:</strong> Customer scans the QR code with their wallet app, which will pre-fill the USDC transfer. After they confirm the transaction, you can mark it as paid.
      </div>
    </div>
  );
}
