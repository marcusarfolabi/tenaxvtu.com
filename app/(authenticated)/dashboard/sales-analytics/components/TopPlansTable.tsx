"use client";

export function TopPlansTable({ plans, isLoading }: { plans: any[]; isLoading?: boolean }) { 

  // 1. Loading Skeleton for Table Rows
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-8 py-5">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-foreground/10 rounded" />
          <div className="h-2 w-16 bg-foreground/5 rounded" />
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <div className="h-6 w-16 bg-foreground/5 rounded-full mx-auto" />
      </td>
      <td className="px-8 py-5 text-right">
        <div className="h-4 w-20 bg-foreground/5 rounded ml-auto" />
      </td>
    </tr>
  );

  return (
    <div className="bg-background border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300">
      <div className="p-8 border-b border-foreground/5 bg-foreground/[0.01]">
        <h2 className="text-xl font-black tracking-tighter text-foreground">Top Selling Plans</h2>
        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Performance by individual bundle</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02]">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-foreground/40 tracking-tighter">Plan & Network</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-foreground/40 text-center tracking-tighter">Total Sales</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-foreground/40 text-right tracking-tighter">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {isLoading ? (
              // Show 5 skeleton rows while loading
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : (
              plans.map((plan, i) => (
                <tr key={i} className="hover:bg-foreground/[0.02] transition-all group cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground group-hover:text-brand-red transition-colors">
                        {plan.plan_name || 'Unknown Plan'}
                      </span>
                      <span className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.1em]">
                        {plan.network}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center justify-center bg-foreground/5 px-4 py-1.5 rounded-full text-[11px] font-black text-foreground/70 group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors">
                      {plan.total_sales} <span className="ml-1 text-[8px] opacity-40">TXNS</span>
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className="text-sm font-black text-green-500 tabular-nums">
                      +₦{Number(plan.total_profit || 0).toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))
            )}

            {!isLoading && plans.length === 0 && (
              <tr>
                <td colSpan={3} className="px-8 py-16 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
                    No Data Found For This Period
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}