import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { TradeScreen } from "@/components/screens/TradeScreen";

export default function TradePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopHeader title="Trade" showSearch={false} />
      <TradeScreen />
      <BottomNav />
    </main>
  );
}

