"use client";
import { useState } from "react";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Hash,
} from "lucide-react";
import { useUsers } from "@/hooks/useUser";
import { Modal } from "../components/ui/Modal";
import { formatActivityDate } from "@/util/date";
import FormSelect from "@/components/common/FormSelect";
import { walletApi } from "@/lib/api/wallet";
import { toast } from "react-hot-toast";
import SubmitButton from "@/components/common/SubmitButton";
import FormInput from "@/components/common/FormInput";

export default function UserList({ limit = 10 }: { limit?: number }) {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { users, pagination, isLoading, isUpdating, updateUserStatus } =
    useUsers({ page, limit });

  // NEW STATE FOR FUNDING
  const [isFunding, setIsFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundReference, setFundReference] = useState("");
  const [isSubmittingFund, setIsSubmittingFund] = useState(false);


  const handleManualFunding = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) return;

    setIsSubmittingFund(true);
    try {
      await walletApi.manualFunding({
        amount: fundAmount,
        reference: fundReference || `MAN-REF-${Date.now()}`,
        user_id: selectedUser.id,
      });

      toast.success(`₦${parseFloat(fundAmount).toLocaleString()} added to user balance`);

      // Cleanup
      setFundAmount("");
      setFundReference("");
      setIsFunding(false);

      // Refresh the list to show new balance: call the user from the useUser hook
      // refreshUsers();
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Funding failed");
    } finally {
      setIsSubmittingFund(false);
    }
  };

  const statusOptions = [
    {
      code: "active",
      name: "Active",
      fullname: "User can perform transactions",
    },
    {
      code: "suspended",
      name: "Suspended",
      fullname: "Restrict user from all actions",
    },
    { code: "pending", name: "Pending", fullname: "Awaiting manual review" },
  ];

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
    <div className="space-y-6 pb-20">
      <div className="bg-brand-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Network Size
          </p>
          <h2 className="text-5xl font-black text-foreground/90 mb-4 tracking-tighter">
            {pagination.total.toLocaleString()}
          </h2>
          <div className="flex items-center gap-2 text-brand-red text-[10px] font-black uppercase tracking-wider bg-foreground/5 border border-foreground/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md">
            <TrendingUp size={14} /> Ranked by Activity
          </div>
        </div>
        <Users
          className="absolute -right-6 -bottom-6 text-foreground/5"
          size={180}
        />
      </div>

      {/* User List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-foreground uppercase text-[10px] tracking-[0.2em]">
            Top Spenders
          </h3>
          <span className="text-[9px] font-bold text-foreground/30 uppercase">
            Last 30 Days
          </span>
        </div>

        {users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user: any, index: number) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="bg-background cursor-pointer p-4 rounded-4xl flex items-center justify-between border border-foreground/5 shadow-sm hover:border-brand-red/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank or Icon */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/5 transition-colors group-hover:bg-brand-red/10">
                      <UserIcon
                        className="text-foreground/40 group-hover:text-brand-red"
                        size={20}
                      />
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-brand-red text-brand-burgundy text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-foreground line-clamp-1">
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <p className="text-[10px] font-bold text-foreground/40 lowercase truncate max-w-30 sm:max-w-none">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-foreground tracking-tight">
                    <span className="text-[10px] text-brand-red mr-0.5">
                      ₦
                    </span>
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
          <div className="text-center py-16 bg-foreground/2 rounded-[2.5rem] border-2 border-dashed border-foreground/5">
            <Users className="mx-auto text-foreground/10 mb-3" size={40} />
            <p className="text-foreground/40 font-black uppercase text-[10px] tracking-widest">
              No users found
            </p>
          </div>
        )}
      </div>

      {/* Pagination - Themed */}
      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-between bg-background p-2 rounded-2xl border border-foreground/5 shadow-xl">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-red text-brand-burgundy disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em]">
              Navigation
            </span>
            <span className="text-[11px] font-black text-foreground">
              {page} <span className="text-foreground/20 mx-1">/</span>{" "}
              {pagination.lastPage}
            </span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))}
            disabled={page === pagination.lastPage}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-red text-brand-burgundy disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Intelligence"
      >
        {selectedUser && (
          <div className="p-6 space-y-6">
            {/* Header: Name & Status */}
            <div className="flex items-center gap-4 border-b border-foreground/5 pb-6">
              <div className="w-16 h-16 rounded-3xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                <UserIcon size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-foreground">
                  {selectedUser.name} {selectedUser.lastname}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {selectedUser.email_verified_at ? (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                      <CheckCircle2 size={10} /> Verified Customer
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-1 rounded-lg">
                      <XCircle size={10} /> Unverified Customer
                    </span>
                  )}
                  {selectedUser.is_identity_verified ? (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                      <ShieldCheck size={10} /> KYC Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                      <ShieldAlert size={10} /> KYC Pending
                    </span>
                  )}
                  <span className="text-[9px] font-black uppercase text-foreground/30 bg-foreground/5 px-2 py-1 rounded-lg">
                    WALLET ID: #{selectedUser.wallet?.wallet_id}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-foreground/5 p-4 rounded-3xl border border-foreground/5">
                <p className="text-[9px] font-black text-foreground/40 uppercase mb-1">
                  Current Balance
                </p>
                <p className="text-lg font-black text-foreground">
                  <span className="text-brand-red mr-1">
                    {selectedUser.wallet?.currency}
                  </span>
                  {parseFloat(selectedUser.wallet?.balance).toLocaleString()}
                </p>
              </div>
              <div className="bg-brand-black border-foreground/5 border p-4 rounded-3xl shadow-xl shadow-brand-red/10">
                <p className="text-[9px] font-black text-foreground/40 uppercase mb-1">
                  Total Funding
                </p>
                <p className="text-lg font-black text-brand-red">
                  {selectedUser.wallet?.currency}

                  {parseFloat(
                    selectedUser.transactions_sum_amount || 0,
                  ).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setIsFunding(!isFunding)}
                className={`p-4 cursor-pointer rounded-3xl transition-all border border-foreground/50 flex flex-col items-start justify-center ${isFunding
                  ? "bg-brand-red  text-brand-burgundy"
                  : "bg-brand-black border-transparent text-brand-red shadow-xl shadow-brand-red/10"
                  }`}
              >
                <p className={`text-[9px] font-black uppercase mb-1 ${isFunding ? "text-brand-burgundy/60" : "text-foreground/40"}`}>
                  {isFunding ? "Cancel Action" : "Wallet Action"}
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isFunding ? "Go Back" : "Manual Fund"}
                  </span>
                </div>
              </button>
            </div>

            {/* Detailed Info List */}
            {isFunding ? (
              <div className="bg-brand-black p-6 rounded-4xl border border-white/5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-4">
                  <FormInput
                    label="Amount to Credit"
                    name="amount"
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    icon={Hash}
                    placeholder="Enter amount (e.g. 5000)"
                  />

                  {/* Added Reference Input so your backend 'reference' isn't always random */}
                  <FormInput
                    label="Funding Reference (Optional)"
                    name="reference"
                    type="text"
                    value={fundReference}
                    onChange={(e) => setFundReference(e.target.value)}
                    icon={ShieldCheck}
                    placeholder="e.g. Bank Transfer Ref"
                  />
                </div>

                <SubmitButton
                  onClick={(e) => {
                    e?.preventDefault();
                    handleManualFunding();
                  }}
                  isLoading={isSubmittingFund}
                  disabled={!fundAmount || parseFloat(fundAmount) <= 0 || isSubmittingFund}
                  idleText={`Confirm Credit ₦${parseFloat(fundAmount || "0").toLocaleString()}`}
                  loadingText="Processing Credit..."
                  className="bg-brand-red text-brand-burgundy h-14 rounded-2xl shadow-lg shadow-brand-red/20 w-full"
                />

                <p className="text-[8px] text-white/20 text-center uppercase font-black tracking-widest">
                  This action will instantly increase the user's balance.
                </p>
              </div>
            ) : (
              <>
                {/* Detailed Info List (Your existing info rows) */}
                <div className="space-y-3 bg-foreground/2 p-4 rounded-3xl border border-foreground/5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-foreground/40 font-bold">
                      <Mail size={14} /> Email
                    </div>
                    <span className="font-black text-foreground lowercase">
                      {selectedUser.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-foreground/40 font-bold">
                      <Phone size={14} /> Phone
                    </div>
                    <span className="font-black text-foreground">
                      {selectedUser.phone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-foreground/40 font-bold">
                      <Calendar size={14} /> Joined Date
                    </div>
                    <span className="font-black text-foreground">
                      {formatActivityDate(selectedUser.wallet?.created_at)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormSelect
                    label="Account Authority"
                    icon={ShieldAlert}
                    options={statusOptions}
                    selectedCode={selectedUser.status}
                    onChange={(newStatus) => updateUserStatus(selectedUser.id, newStatus)}
                    disabled={isUpdating}
                  />

                  <SubmitButton
                    isLoading={isUpdating}
                    idleText="Update Status"
                    loadingText="Updating..."
                    className="bg-brand-red text-brand-burgundy h-14 rounded-2xl shadow-lg shadow-brand-red/20 w-full"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
