"use client";

import { QrCode, Wallet, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cast-POS
          </h1>
          <p className="text-gray-600">
            Accept crypto payments & manage treasury
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <Link href="/accept">
            <div className="cursor-pointer hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">Accept Payment</h3>
                  <p className="text-blue-100 text-sm">
                    Generate QR code for USDC payments
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/treasury">
            <div className="cursor-pointer hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">Treasury</h3>
                  <p className="text-green-100 text-sm">
                    Manage balance & allocate surplus
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Features
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  QR Code Payments
                </h4>
                <p className="text-sm text-gray-600">
                  Generate EIP-681 payment URIs that work with any wallet
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  USDC on Base Sepolia
                </h4>
                <p className="text-sm text-gray-600">
                  Low fees (~$0.01) and fast settlement (~2 seconds)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Treasury Management
                </h4>
                <p className="text-sm text-gray-600">
                  Set operating targets and auto-allocate surplus to reserves
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
          <h3 className="font-semibold mb-2">
            Getting Started
          </h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Configure your merchant wallet address</li>
            <li>Go to Accept Payment to generate QR codes</li>
            <li>Connect wallet in Treasury to manage funds</li>
            <li>Set operating target and allocate surplus</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
