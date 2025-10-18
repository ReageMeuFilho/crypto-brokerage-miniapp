import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ActivityScreen } from "@/components/screens/ActivityScreen";

export default function ActivityPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopHeader title="Activity" showSearch={false} />
      <ActivityScreen />
      <BottomNav />
    </main>
  );
}

