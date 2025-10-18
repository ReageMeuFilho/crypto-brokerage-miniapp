"use client";
import { useEffect, useMemo, useState } from "react";
import { USDC, EXPLORER, USDC_DECIMALS, RESERVE } from "@/lib/chain";
import { erc20Abi, createWalletClient, createPublicClient, custom, http, parseUnits, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";

export default function TreasuryScreen() {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [target, setTarget] = useState("1000");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    try {
      if (!(window as any).ethereum) return;
      const [addr] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      setAddress(addr);
      
      const publicClient = createPublicClient({ 
        chain: baseSepolia,
        transport: http()
      });
      
      const bal = await publicClient.readContract({ 
        address: USDC as `0x${string}`, 
        abi: erc20Abi, 
        functionName: "balanceOf", 
        args: [addr] 
      }) as bigint;
      
      setBalance(bal);
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  }

  const canAllocate = useMemo(() => {
    const t = parseUnits(Number(target || "0").toFixed(6), USDC_DECIMALS);
    return balance > t;
  }, [balance, target]);

  const surplus = useMemo(() => {
    const t = parseUnits(Number(target || "0").toFixed(6), USDC_DECIMALS);
    return balance > t ? balance - t : BigInt(0);
  }, [balance, target]);

  async function allocate() {
    if (!(window as any).ethereum) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      setLoading(true);
      const [addr] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const client = createWalletClient({ 
        chain: baseSepolia,
        transport: custom((window as any).ethereum) 
      });
      
      const t = parseUnits(Number(target || "0").toFixed(6), USDC_DECIMALS);
      const surplusAmount = balance - t;
      
      const hash = await client.writeContract({
        address: USDC as `0x${string}`,
        abi: erc20Abi,
        functionName: "transfer",
        args: [RESERVE as `0x${string}`, surplusAmount],
        account: addr as `0x${string}`,
      });
      
      alert(`Transaction submitted! Hash: ${hash}`);
      
      setTimeout(() => {
        loadBalance();
      }, 2000);
    } catch (error: any) {
      console.error("Error allocating:", error);
      alert(`Error: ${error.message || "Failed to allocate"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="text-2xl font-semibold">Treasury</div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Current USDC Balance</div>
          <div className="text-3xl font-bold text-gray-900">
            ${Number(formatUnits(balance, USDC_DECIMALS)).toFixed(2)}
          </div>
          <a 
            className="text-xs text-blue-600 underline mt-2 inline-block" 
            href={`${EXPLORER}/token/${USDC}?a=${address}`} 
            target="_blank"
            rel="noopener noreferrer"
          >
            View on explorer
          </a>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Operating Target (USD)</label>
          <input 
            value={target} 
            onChange={e => setTarget(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg p-3 text-lg"
            placeholder="1000.00"
            inputMode="decimal"
          />
          <p className="text-xs text-gray-500 mt-1">
            Keep this amount in your operating wallet. Surplus will be allocated to reserve.
          </p>
        </div>

        {canAllocate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-800 mb-1">Surplus Available</div>
            <div className="text-2xl font-bold text-green-900">
              ${Number(formatUnits(surplus, USDC_DECIMALS)).toFixed(2)}
            </div>
          </div>
        )}

        <button 
          className="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canAllocate || loading} 
          onClick={allocate}
        >
          {loading ? "Processing..." : canAllocate ? `Allocate $${Number(formatUnits(surplus, USDC_DECIMALS)).toFixed(2)} to Reserve` : "No surplus to allocate"}
        </button>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Reserve Address</div>
          <div className="text-xs font-mono bg-gray-50 p-3 rounded break-all text-gray-600">
            {RESERVE || "Not configured"}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>How it works:</strong> Set your operating target. When your balance exceeds this amount, you can allocate the surplus to your reserve wallet with one click. This helps you maintain optimal cash flow while securing excess funds.
      </div>
    </div>
  );
}
