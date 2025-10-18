import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { MarketsScreen } from "@/components/screens/MarketsScreen";

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopHeader title="Markets" showSearch={false} />
      <MarketsScreen />
      <BottomNav />
    </main>
  );
}

