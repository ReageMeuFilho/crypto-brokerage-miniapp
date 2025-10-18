import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { env } from "@/lib/env";
import { Metadata } from "next";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/og-image.png`,
  button: {
    title: "Launch App",
    action: {
      type: "launch_frame",
      name: "Crypto Brokerage",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#1f2937",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Crypto Brokerage - Trade on Base",
    openGraph: {
      title: "Crypto Brokerage",
      description: "A mobile-first crypto trading platform for Base network",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopHeader title="Crypto Brokerage" />
      <HomeScreen />
      <BottomNav />
    </main>
  );
}

