"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useWalletClient, useSwitchChain } from "wagmi";
import { createPublicClient, http, formatUnits, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { Wallet, ExternalLink, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency, truncateAddress } from "@/lib/utils";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;

export default function TreasuryPage() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();

  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [operatingTarget, setOperatingTarget] = useState("");
  const [isAllocating, setIsAllocating] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;
  const reserveAddress = process.env.NEXT_PUBLIC_RESERVE_ADDRESS as `0x${string}`;
  const explorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "";
  const targetChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "84532");

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    }
  }, [isConnected, address]);

  const fetchBalance = async () => {
    if (!address) return;

    try {
      const result = await publicClient.readContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setBalance(result as bigint);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
    }
  };

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const handleAllocate = async () => {
    if (!walletClient || !address) return;

    if (chain?.id !== targetChainId) {
      try {
        await switchChain({ chainId: targetChainId });
      } catch (err) {
        setError("Please switch to Base Sepolia network");
        return;
      }
    }

    setIsAllocating(true);
    setError("");
    setTxHash("");

    try {
      const targetAmount = parseUnits(operatingTarget || "0", 6);
      const surplus = balance - targetAmount;

      if (surplus <= BigInt(0)) {
        setError("No surplus to allocate");
        setIsAllocating(false);
        return;
      }

      const hash = await walletClient.writeContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [reserveAddress, surplus],
      });

      setTxHash(hash);
      
      setTimeout(() => {
        fetchBalance();
      }, 3000);
    } catch (err: any) {
      console.error("Error allocating funds:", err);
      setError(err.message || "Failed to allocate funds");
    } finally {
      setIsAllocating(false);
    }
  };

  const balanceFormatted = parseFloat(formatUnits(balance, 6));
  const targetFormatted = parseFloat(operatingTarget || "0");
  const surplus = balanceFormatted - targetFormatted;
  const canAllocate = surplus > 0 && isConnected && !isAllocating;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Treasury Management
          </h1>
          <p className="text-gray-600">
            Manage your USDC balance and allocate surplus to reserves
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Connect your wallet to view balance and manage treasury
            </p>
            <button
              onClick={handleConnect}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Wallet size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {truncateAddress(address || "")}
                  </span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Disconnect
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={20} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Current USDC Balance
                  </span>
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  {formatCurrency(balanceFormatted)}
                </div>
                <a
                  href={`${explorerUrl}/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  <ExternalLink size={14} />
                  View on Explorer
                </a>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Target (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={operatingTarget}
                    onChange={(e) => setOperatingTarget(e.target.value)}
                    placeholder="1000.00"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {operatingTarget && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Operating Target
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(targetFormatted)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        size={16}
                        className={surplus > 0 ? "text-green-600" : "text-gray-400"}
                      />
                      <span className="text-sm text-gray-600">Surplus</span>
                    </div>
                    <span
                      className={`font-semibold ${
                        surplus > 0 ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {formatCurrency(Math.max(0, surplus))}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                  {error}
                </div>
              )}

              {txHash && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-800 mb-2">
                    ✓ Transaction submitted successfully!
                  </p>
                  <a
                    href={`${explorerUrl}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800"
                  >
                    <ExternalLink size={14} />
                    View Transaction
                  </a>
                </div>
              )}

              <button
                onClick={handleAllocate}
                disabled={!canAllocate}
                className={`w-full py-4 rounded-xl font-semibold transition-colors ${
                  canAllocate
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isAllocating
                  ? "Allocating..."
                  : `Allocate ${formatCurrency(Math.max(0, surplus))} to Reserve`}
              </button>

              <div className="mt-4 text-center">
                <a
                  href={`${explorerUrl}/address/${reserveAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700"
                >
                  <ExternalLink size={14} />
                  View Reserve Wallet
                </a>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">How Treasury Works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Set your operating target (minimum balance to keep)</li>
                <li>System calculates surplus above target</li>
                <li>Click &ldquo;Allocate&rdquo; to transfer surplus to reserve wallet</li>
                <li>Funds are sent on-chain via USDC transfer</li>
                <li>Keep reserves safe in a separate wallet</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
