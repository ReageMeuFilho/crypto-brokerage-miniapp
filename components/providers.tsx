"use client";

import { MiniAppProvider } from "@/contexts/miniapp-context";
import { UserProvider } from "@/contexts/user-context";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

// Wagmi configuration
const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Crypto Brokerage",
      preference: "smartWalletOnly",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ErudaProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
            config={{
              appearance: {
                mode: "auto",
                theme: "default",
              },
            }}
          >
            <MiniAppProvider addMiniAppOnLoad={true}>
              <UserProvider autoSignIn={true}>{children}</UserProvider>
            </MiniAppProvider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErudaProvider>
  );
}

