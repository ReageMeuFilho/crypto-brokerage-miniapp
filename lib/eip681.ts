import { USDC, MERCHANT } from "@/lib/chain";

export function buildEip681Erc20(amountWei: bigint, chainId: number) {
  return `ethereum:${USDC}/transfer?address=${MERCHANT}&uint256=${amountWei}&chain_id=${chainId}`;
}
