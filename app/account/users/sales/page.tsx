"use client";
import { useState } from "react";
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
  
  const { stats, isLoading } = useSalesStats(filters, initialStats);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      // Small delay ensures the UI is settled before capture
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await downloadDashboardPDF(
        "analytics-report",
        `Data-Report-${filters.from}-to-${filters.to}`
      );
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!stats && isLoading) {
    return (
      <div className="p-6 space-y-6 bg-background">
        <div className="h-20 w-full bg-foreground/5 animate-pulse rounded-[2rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-foreground/5 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-6 relative bg-background min-h-screen text-foreground">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DateFilter filters={filters} setFilters={setFilters} />

        <div className="flex items-center gap-3">
          {isLoading && (
            <Loader2 className="animate-spin text-brand-gold" size={18} />
          )}
          <button
            onClick={handleDownload}
            disabled={isExporting || isLoading}
            className="flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
          >
            <Download size={16} />
            {isExporting ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div
        id="analytics-report"
        data-rendering="pdf"
        className={`print-safe space-y-6 bg-background border border-foreground/5 p-6 rounded-[2.5rem] transition-opacity duration-300 ${
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <StatCards totals={stats?.totals} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MainPerformanceChart data={stats?.chart || []} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-1">
            <NetworkPieChart networks={stats?.networks || []} isLoading={isLoading} />
          </div>
        </div>

        <TopPlansTable plans={stats?.top_plans || []} isLoading={isLoading} />
      </div>
    </div>
  );
}