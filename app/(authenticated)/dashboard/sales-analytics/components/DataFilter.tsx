"use client";
import { Calendar } from "lucide-react";

export function DateFilter({ filters, setFilters }: any) {
  const quickRanges = [
    { label: "Today", days: 0 },
    { label: "7 Days", days: 7 },
    { label: "30 Days", days: 30 },
  ];

  const handleQuickSelect = (days: number) => {
    const now = new Date(); 
    const to = now.toISOString().split("T")[0]; 
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    const from = fromDate.toISOString().split("T")[0]; 
    if (from && to) {
      setFilters({ from, to });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-background border border-foreground/5 p-4 rounded-[2rem] mb-8">
      {/* Quick Select Buttons */}
      <div className="flex items-center gap-2">
        {quickRanges.map((r) => (
          <button
            key={r.label}
            onClick={() => handleQuickSelect(r.days)}
            className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-foreground/5 text-foreground hover:bg-brand-red hover:text-brand-burgundy transition-all border border-transparent hover:border-brand-red"
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Manual Date Inputs */}
      <div className="flex items-center gap-3 bg-foreground/5 px-4 py-2 rounded-full border border-foreground/10">
        <Calendar size={14} className="text-brand-red" />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="bg-transparent text-[11px] font-bold outline-none text-foreground color-scheme-dark focus:text-brand-red transition-colors"
          />
          <span className="text-foreground/20 text-[10px] font-black">—</span>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="bg-transparent text-[11px] font-bold outline-none text-foreground color-scheme-dark focus:text-brand-red transition-colors"
          />
        </div>
      </div>
    </div>
  );
}