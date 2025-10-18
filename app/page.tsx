import HomePage from "@/components/pages/home";
import { env } from "@/lib/env";
import { Metadata } from "next";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/feed.png`,
  button: {
    title: "Launch App",
    action: {
      type: "launch_frame",
      name: "Cast-POS",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#1f2937",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cast-POS - Accept Crypto Payments",
    openGraph: {
      title: "Cast-POS",
      description: "Mini-POS for SMBs - Accept USDC payments and manage treasury on Base",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <HomePage />;
}
