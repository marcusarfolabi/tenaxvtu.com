"use client";
import { TrendingUp, ShoppingBag, Hash } from 'lucide-react';

export function StatCards({ totals, isLoading }: { totals: any; isLoading?: boolean }) {
  // Debugging: Tracking data flow for the "Illegal Operator" investigation
  console.log("💎 StatCards Render Data:", totals);

  const items = [
    { 
      label: 'Total Sales', 
      value: totals?.total_sales ? `₦${Number(totals.total_sales).toLocaleString()}` : '₦0', 
      icon: <ShoppingBag size={20} />, 
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10'
    },
    { 
      label: 'Total Profit', 
      value: totals?.total_profit ? `₦${Number(totals.total_profit).toLocaleString()}` : '₦0', 
      icon: <TrendingUp size={20} />, 
      color: 'text-green-500', // Success green typically stays semantic
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Total Count', 
      value: totals?.total_count ?? 0, 
      icon: <Hash size={20} />, 
      color: 'text-foreground/60',
      bgColor: 'bg-foreground/5'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <div 
          key={item.label} 
          className="bg-background border border-foreground/5 p-6 rounded-[2rem] min-h-[140px] flex flex-col justify-center transition-all duration-300 hover:border-foreground/10"
        >
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="size-10 bg-foreground/10 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-2 w-16 bg-foreground/10 rounded" />
                <div className="h-6 w-24 bg-foreground/10 rounded" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className={`p-3 rounded-2xl ${item.bgColor} ${item.color}`}>
                  {item.icon}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase text-foreground/40 tracking-[0.15em]">
                {item.label}
              </p>
              <h3 className="text-2xl font-black tracking-tighter mt-1 text-foreground tabular-nums">
                {item.value}
              </h3>
            </>
          )}
        </div>
      ))}
    </div>
  );
}