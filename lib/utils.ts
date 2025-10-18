import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function buildEip681Erc20(
  tokenAddress: string,
  recipientAddress: string,
  amount: bigint,
  chainId: number
): string {
  return `ethereum:${tokenAddress}/transfer?address=${recipientAddress}&uint256=${amount.toString()}&chainId=${chainId}`;
}

export function generateOrderId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
