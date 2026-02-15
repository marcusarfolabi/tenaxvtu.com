"use client";
import { useState } from "react";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import { useUsers } from "@/hooks/useUser";

export default function UserList({ limit = 10 }: { limit?: number }) {
  const [page, setPage] = useState(1);
  const { users, pagination, isLoading } = useUsers({ page, limit });

  console.log(users);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-gray-100 rounded-3xl w-full" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-50 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stat Card - Locked Brand Black */}
      <div className="bg-brand-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Network Size
          </p>
          <h2 className="text-5xl font-black mb-4 tracking-tighter">
            {pagination.total.toLocaleString()}
          </h2>
          <div className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md">
            <TrendingUp size={14} /> Ranked by Activity
          </div>
        </div>
        <Users
          className="absolute -right-6 -bottom-6 text-white/5"
          size={180}
        />
      </div>

      {/* User List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-foreground uppercase text-[10px] tracking-[0.2em]">Top Spenders</h3>
          <span className="text-[9px] font-bold text-foreground/30 uppercase">Last 30 Days</span>
        </div>

        {users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user: any, index: number) => (
              <div
                key={user.id}
                className="bg-background p-4 rounded-[2rem] flex items-center justify-between border border-foreground/5 shadow-sm hover:border-brand-gold/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank or Icon */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/5 transition-colors group-hover:bg-brand-gold/10">
                      <UserIcon className="text-foreground/40 group-hover:text-brand-gold" size={20} />
                    </div>
                    {index < 3 && (
                       <div className="absolute -top-1 -left-1 w-5 h-5 bg-brand-gold text-brand-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background">
                         {index + 1}
                       </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-black text-foreground line-clamp-1">
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <p className="text-[10px] font-bold text-foreground/40 lowercase truncate max-w-[120px] sm:max-w-none">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-foreground tracking-tight">
                    <span className="text-[10px] text-brand-gold mr-0.5">₦</span>
                    {parseFloat(
                      user.transactions_sum_amount || 0,
                    ).toLocaleString()}
                  </p>
                  <p className="text-[8px] font-black text-foreground/30 uppercase tracking-tighter">
                    Volume
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-foreground/[0.02] rounded-[2.5rem] border-2 border-dashed border-foreground/5">
            <Users className="mx-auto text-foreground/10 mb-3" size={40} />
            <p className="text-foreground/40 font-black uppercase text-[10px] tracking-widest">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination - Themed */}
      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-between bg-background p-2 rounded-2xl border border-foreground/5 shadow-xl">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-gold text-brand-black disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
             <span className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em]">Navigation</span>
             <span className="text-[11px] font-black text-foreground">
                {page} <span className="text-foreground/20 mx-1">/</span> {pagination.lastPage}
             </span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))}
            disabled={page === pagination.lastPage}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-gold text-brand-black disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
