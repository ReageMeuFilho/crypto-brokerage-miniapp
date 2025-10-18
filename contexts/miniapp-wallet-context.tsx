import { farcasterFrame as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, arbitrumSepolia } from "wagmi/chains";
import { metaMask, coinbaseWallet } from "wagmi/connectors";
import { defineChain } from "viem";

const bellecour = defineChain({
  id: 134,
  name: 'iExec Sidechain',
  nativeCurrency: {
    decimals: 18,
    name: 'xRLC',
    symbol: 'xRLC',
  },
  rpcUrls: {
    default: { http: ['https://bellecour.iex.ec'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://blockscout-bellecour.iex.ec' },
  },
});

export const config = createConfig({
  chains: [base, arbitrumSepolia, bellecour],
  transports: {
    [base.id]: http(),
    [arbitrumSepolia.id]: http(),
    [bellecour.id]: http('https://bellecour.iex.ec'),
  },
  connectors: [
    miniAppConnector(),
    metaMask(),
    coinbaseWallet({
      appName: "Crypto Brokerage",
      preference: "smartWalletOnly",
    }),
  ],
});

const queryClient = new QueryClient();

export default function MiniAppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
