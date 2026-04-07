"use client";
import Link from "next/link";
import { ACCOUNT_QUICK_ACTION_MENU } from "@/settings";
import { BalanceCard } from "./components/BalanceCard";
import { useRouter } from "next/navigation";
import { TransactionList } from "./components/TransactionList";

export default function Account() {
  const router = useRouter();
  return (
    <div className="space-y-8 pb-20" suppressHydrationWarning>
      <BalanceCard onTopup={() => router.push("/account/virtual-accounts")} />

      <div className="grid grid-cols-4 gap-4">
        {ACCOUNT_QUICK_ACTION_MENU.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-transform`}
            >
              <action.icon size={24} />
            </div>
            <span className="text-[11px] font-bold text-gray-600">
              {action.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="relative w-full h-32 bg-linear-to-r from-brand-red to-[#B8860B] rounded-3xl overflow-hidden group">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative h-full flex flex-col justify-center px-6">
          <h3 className="text-brand-burgundy font-black text-lg leading-tight">
            Refer & Earn <br />{" "}
            <span className="text-white">₦500 per friend</span>
          </h3>
          <button className="mt-2 text-[10px] font-black uppercase bg-brand-black text-white px-3 py-1.5 rounded-lg w-fit">
            Get Link
          </button>
        </div>
        {/* Simple slide indicator dots */}
        <div className="absolute bottom-3 right-6 flex gap-1">
          <div className="w-4 h-1 bg-brand-black rounded-full" />
          <div className="w-1 h-1 bg-brand-black/30 rounded-full" />
          <div className="w-1 h-1 bg-brand-black/30 rounded-full" />
        </div>
      </div>

      <TransactionList limit={10} showTitle={true} type="all" />
    </div>
  );
}
