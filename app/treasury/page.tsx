import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import TreasuryScreen from "@/components/screens/TreasuryScreen";

export default function TreasuryPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopHeader title="Treasury" showSearch={false} />
      <div className="pb-20 pt-16">
        <TreasuryScreen />
      </div>
      <BottomNav />
    </main>
  );
}
