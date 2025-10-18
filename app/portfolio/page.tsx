import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { PortfolioScreen } from "@/components/screens/PortfolioScreen";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopHeader title="Portfolio" showSearch={false} />
      <PortfolioScreen />
      <BottomNav />
    </main>
  );
}

