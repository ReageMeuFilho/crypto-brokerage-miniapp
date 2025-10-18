import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import AcceptScreen from "@/components/screens/AcceptScreen";

export default function AcceptPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopHeader title="Accept Payment" showSearch={false} />
      <div className="pb-20 pt-16">
        <AcceptScreen />
      </div>
      <BottomNav />
    </main>
  );
}
