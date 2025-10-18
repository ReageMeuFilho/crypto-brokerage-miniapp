"use client";

import { MiniAppProvider } from "@/contexts/miniapp-context";
import { UserProvider } from "@/contexts/user-context";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErudaProvider>
      <MiniAppProvider addMiniAppOnLoad={true}>
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
          <UserProvider autoSignIn={true}>{children}</UserProvider>
        </OnchainKitProvider>
      </MiniAppProvider>
    </ErudaProvider>
  );
}

