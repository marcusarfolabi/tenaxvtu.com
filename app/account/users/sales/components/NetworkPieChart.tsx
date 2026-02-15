"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mapping network names to CSS variables or semantic colors
const COLORS: Record<string, string> = { 
  MTN: 'var(--brand-gold, #EAB308)', 
  GLO: '#22C55E', 
  AIRTEL: '#EF4444', 
  '9MOBILE': '#166534' 
};

export function NetworkPieChart({ networks, isLoading }: { networks: any[]; isLoading?: boolean }) {
  // Debug logging
  console.log("🥧 Network Data Received:", networks);

  const data = networks?.map(n => ({ 
    name: n.network?.toUpperCase(), 
    value: Number(n.sales) 
  })) || [];

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-background border border-foreground/5 p-8 rounded-[2.5rem] h-full shadow-xl flex flex-col items-center">
        <div className="w-full self-start space-y-2 mb-10">
          <div className="h-6 w-32 bg-foreground/10 animate-pulse rounded-lg" />
          <div className="h-2 w-20 bg-foreground/5 animate-pulse rounded-full" />
        </div>
        <div className="relative size-48 rounded-full border-[12px] border-foreground/5 animate-pulse flex items-center justify-center">
             <div className="size-24 rounded-full bg-foreground/[0.02]" />
        </div>
        <div className="mt-10 flex gap-4">
            <div className="h-3 w-12 bg-foreground/5 rounded-full animate-pulse" />
            <div className="h-3 w-12 bg-foreground/5 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-foreground/5 p-8 rounded-[2.5rem] h-full shadow-xl transition-all duration-300">
      <h2 className="text-xl font-black tracking-tighter text-foreground">Network Usage</h2>
      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-6">Sales by Provider</p>
      
      <div className="h-[300px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={70} 
                outerRadius={90} 
                paddingAngle={8} 
                dataKey="value"
                stroke="none"
              >
                {data.map((entry: any) => (
                  <Cell 
                    key={entry.name} 
                    fill={COLORS[entry.name] || 'var(--foreground-20, #8884d8)'} 
                    className="hover:opacity-80 transition-opacity outline-none"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderRadius: '1rem', 
                  border: '1px solid var(--foreground-10)',
                  fontSize: '10px',
                  fontWeight: '900'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                iconType="circle" 
                formatter={(value) => <span className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
             <div className="size-24 rounded-full border-4 border-dashed border-foreground/50 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest">No Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
}