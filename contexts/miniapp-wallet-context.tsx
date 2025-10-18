import { farcasterFrame as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, arbitrumSepolia } from "wagmi/chains";
import { metaMask, coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [base, arbitrumSepolia],
  transports: {
    [base.id]: http(),
    [arbitrumSepolia.id]: http(),
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
