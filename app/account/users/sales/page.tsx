"use client";
import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import MainPerformanceChart from "./components/MainPerformanceChart";
import { NetworkPieChart } from "./components/NetworkPieChart";
import { TopPlansTable } from "./components/TopPlansTable";
import { downloadDashboardPDF } from "@/util/export";
import { useSalesStats } from "@/hooks/useSalesStats";
import { StatCards } from "./components/StatsCards";
import { DateFilter } from "./components/DataFilter";

export default function DataStatsPage({ stats: initialStats }: { stats: any }) { 

  const [filters, setFilters] = useState({
    from: initialStats?.range?.from || "",
    to: initialStats?.range?.to || "",
  });

  const [isExporting, setIsExporting] = useState(false);

  // Real-time data fetching
  const { stats, isLoading, isError } = useSalesStats(filters, initialStats);

  // Debugging live updates and errors
  useEffect(() => {
    if (stats) console.log("🔄 Live Stats Update:", stats);
    if (isError) console.error("❌ Stats Fetch Error:", isError);
  }, [stats, isError]);

  // Monitor filter changes to catch "Illegal Operator" empty strings
  useEffect(() => { 
    if (!filters.from || !filters.to) {
      console.warn(
        "⚠️ Warning: One of the date filters is empty. This may crash the backend query.",
      );
    }
  }, [filters]);

  if (!stats && isLoading) {
    return (
      <div className="p-6 space-y-6 bg-background">
        <div className="h-20 w-full bg-foreground/5 animate-pulse rounded-[2rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-foreground/5 animate-pulse rounded-[2rem]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 relative bg-background min-h-screen text-foreground">
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DateFilter filters={filters} setFilters={setFilters} />

        <div className="flex items-center gap-3">
          {isLoading && (
            <Loader2 className="animate-spin text-brand-gold" size={18} />
          )}
          <button
            onClick={() => window.print()}
            disabled={isExporting || isLoading}
            className="flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
          >
            <Download size={16} />
            {isExporting ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div
        id="analytics-report"
        className={`print-safe space-y-6 bg-background border border-foreground/5 p-6 rounded-[2.5rem] transition-opacity duration-300 ${
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <StatCards totals={stats?.totals} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MainPerformanceChart data={stats?.chart || []} />
          </div>
          <div className="lg:col-span-1">
            <NetworkPieChart networks={stats?.networks || []} />
          </div>
        </div>

        <TopPlansTable plans={stats?.top_plans || []} />
      </div>
    </div>
  );
}
