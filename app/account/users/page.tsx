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
      {/* Summary Stat Card */}
      <div className="bg-brand-black p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">
            Total Customers
          </p>
          <h2 className="text-4xl font-black mb-4">{pagination.total}</h2>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full">
            <TrendingUp size={14} /> Ranked by Activity
          </div>
        </div>
        <Users
          className="absolute -right-4 -bottom-4 text-white/5"
          size={140}
        />
      </div>

      {/* User List */}
      <div className="space-y-3">
        <h3 className="font-black text-gray-900 px-1">Top Spenders</h3>
        {users.length > 0 ? (
          users.map((user: any) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-100 shadow-sm hover:border-brand-gold/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  <UserIcon className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 line-clamp-1">
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-brand-black">
                  ₦
                  {parseFloat(
                    user.transactions_sum_amount || 0,
                  ).toLocaleString()}
                </p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                  Total Spent
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Users className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 font-bold text-sm">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl bg-brand-gold disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-[10px] font-black text-gray-500">
            PAGE {page} OF {pagination.lastPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))}
            disabled={page === pagination.lastPage}
            className="p-2 rounded-xl bg-brand-gold disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
