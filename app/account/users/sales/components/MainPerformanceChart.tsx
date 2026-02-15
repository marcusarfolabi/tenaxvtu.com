"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MainPerformanceChart({
  data,
  isLoading,
}: {
  data: any[];
  isLoading?: boolean;
}) {
  if (isLoading && (!data || data.length === 0)) {
    const skeletonHeights = ["60%", "45%", "80%", "55%", "70%", "40%", "65%"];
    return (
      <div className="bg-background border border-foreground/5 p-8 rounded-[2.5rem] shadow-xl h-120 flex flex-col">
        <div className="animate-pulse space-y-2 mb-8">
          <div className="h-6 w-48 bg-foreground/10 rounded-lg" />
          <div className="h-2 w-32 bg-foreground/5 rounded-full" />
        </div>
        <div className="flex-1 flex items-end gap-4 px-4">
          {skeletonHeights.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-foreground/5 animate-pulse rounded-t-xl"
              style={{ height }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-foreground/5 p-8 rounded-[2.5rem] shadow-xl h-full transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black tracking-tighter text-foreground">
            Performance Overview
          </h2>
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
            Revenue vs Profit
          </p>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-foreground/5"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 10, fontWeight: 900 }}
              className="text-foreground/30"
              tickFormatter={(str) =>
                new Date(str).toLocaleDateString("en-US", { weekday: "short" })
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 10 }}
              className="text-foreground/30"
            />
            <Tooltip
              cursor={{
                fill: "currentColor",
                className: "text-foreground/[0.03]",
              }}
              contentStyle={{
                backgroundColor: "var(--background)",
                borderRadius: "1.5rem",
                border: "1px solid var(--foreground-5, rgba(255,255,255,0.1))",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{
                fontSize: "12px",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
            />
            {/* Using brand-gold color variable logic */}
            <Bar
              dataKey="sales"
              fill="var(--brand-gold, #EAB308)"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="profit"
              fill="var(--brand-gold, #EAB308)"
              fillOpacity={0.2}
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
