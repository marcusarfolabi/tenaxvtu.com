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
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useUsers } from "@/hooks/useUser";
import { Modal } from "../components/ui/Modal";
import { formatActivityDate } from "@/util/date";
import FormSelect from "@/components/common/FormSelect";
import { walletApi } from "@/lib/api/wallet";
import { profileApi } from "@/lib/api/profile";
import { toast } from "react-hot-toast";
import SubmitButton from "@/components/common/SubmitButton";
import FormInput from "@/components/common/FormInput";

export default function UserList({ limit = 10 }: { limit?: number }) {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { users, pagination, isLoading, isUpdating, updateUserStatus, refreshUsers } =
    useUsers({ page, limit });

  // STATE FOR FUNDING
  const [isFunding, setIsFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundReference, setFundReference] = useState("");
  const [isSubmittingFund, setIsSubmittingFund] = useState(false);

  // NEW STATE FOR DELETION
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

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

      // 1. Reset Form Fields
      setFundAmount("");
      setFundReference("");

      // 2. Reset View States
      setIsFunding(false);

      // 3. Close Modal
      setSelectedUser(null);

      // 4. Sync Data
      if (refreshUsers) refreshUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Funding failed");
    } finally {
      setIsSubmittingFund(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsSubmittingDelete(true);
    try {
      await profileApi.deleteUser({ user_id: selectedUser.id });

      toast.success("User account permanently deleted");

      // 1. Reset View States
      setIsDeleting(false);

      // 2. Close Modal
      setSelectedUser(null);

      // 3. Sync Data
      if (refreshUsers) refreshUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Deletion failed");
    } finally {
      setIsSubmittingDelete(false);
    }
  };
  const statusOptions = [
    { code: "active", name: "Active", fullname: "User can perform transactions" },
    { code: "suspended", name: "Suspended", fullname: "Restrict user from all actions" },
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
      {/* Header Section */}
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
        <Users className="absolute -right-6 -bottom-6 text-foreground/5" size={180} />
      </div>

      {/* User List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-foreground uppercase text-[10px] tracking-[0.2em]">Top Spenders</h3>
          <span className="text-[9px] font-bold text-foreground/30 uppercase">Last 30 Days</span>
        </div>

        {users.map((user: any, index: number) => (
          <div
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setIsFunding(false);
              setIsDeleting(false);
            }}
            className="bg-background cursor-pointer p-4 rounded-4xl flex items-center justify-between border border-foreground/5 shadow-sm hover:border-brand-red/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/5 group-hover:bg-brand-red/10">
                <UserIcon className="text-foreground/40 group-hover:text-brand-red" size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-foreground">{user.name || user.email.split("@")[0]}</p>
                <p className="text-[10px] font-bold text-foreground/40 lowercase truncate">{user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-foreground">
                <span className="text-brand-red mr-0.5">₦</span>
                {parseFloat(user.transactions_sum_amount || 0).toLocaleString()}
              </p>
              <p className="text-[8px] font-black text-foreground/30 uppercase">Volume</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-between bg-background p-2 rounded-2xl border border-foreground/5 shadow-xl">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-red text-brand-burgundy disabled:opacity-20 transition-all active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-black text-foreground">{page} <span className="text-foreground/20 mx-1">/</span> {pagination.lastPage}</span>
          </div>
          <button onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))} disabled={page === pagination.lastPage} className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-red text-brand-burgundy disabled:opacity-20 transition-all active:scale-90">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Intelligence">
        {selectedUser && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-foreground/5 pb-6">
              <div className="w-16 h-16 rounded-3xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                <UserIcon size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-foreground tracking-tight leading-tight">
                  {selectedUser.name} {selectedUser.lastname}
                </h4>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Email Verification Status */}
                  <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-colors ${selectedUser.email_verified_at
                      ? "text-green-500 bg-green-500/10 border border-green-500/10"
                      : "text-red-500 bg-red-500/10 border border-red-500/10"
                    }`}>
                    {selectedUser.email_verified_at ? <Mail size={10} /> : <XCircle size={10} />}
                    {selectedUser.email_verified_at ? "Email Verified" : "Email Pending"}
                  </span>

                  {/* KYC / Identity Status */}
                  <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-colors ${selectedUser.is_identity_verified
                      ? "text-blue-500 bg-blue-500/10 border border-blue-500/10"
                      : "text-orange-500 bg-orange-500/10 border border-orange-500/10"
                    }`}>
                    {selectedUser.is_identity_verified ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                    {selectedUser.is_identity_verified ? "KYC Verified" : "KYC Pending"}
                  </span>

                  {/* Wallet Reference */}
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-foreground/40 bg-foreground/5 px-2.5 py-1 rounded-lg border border-foreground/5">
                    <Hash size={10} className="opacity-50" />
                    Wallet: {selectedUser.wallet?.wallet_id || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Grid + Actions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-foreground/5 p-4 rounded-3xl border border-foreground/5">
                <p className="text-[9px] font-black text-foreground/40 uppercase mb-1">Current Balance</p>
                <p className="text-lg font-black text-foreground"><span className="text-brand-red mr-1">{selectedUser.wallet?.currency}</span>{parseFloat(selectedUser.wallet?.balance).toLocaleString()}</p>
              </div>

              {/* Toggle Buttons */}
              <button
                onClick={() => { setIsFunding(!isFunding); setIsDeleting(false); }}
                className={`p-4 rounded-3xl transition-all border flex flex-col items-start justify-center ${isFunding ? "bg-brand-red text-brand-burgundy border-brand-red" : "bg-brand-black text-brand-red border-white/5"}`}
              >
                <p className={`text-[9px] font-black uppercase mb-1 ${isFunding ? "text-brand-burgundy/60" : "text-foreground/40"}`}>Wallet Action</p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} /> <span className="text-[10px] font-black uppercase">{isFunding ? "Cancel" : "Fund"}</span>
                </div>
              </button>

              <button
                onClick={() => { setIsDeleting(!isDeleting); setIsFunding(false); }}
                className={`p-4 rounded-3xl transition-all border flex flex-col items-start justify-center ${isDeleting ? "bg-red-600 text-white border-red-600" : "bg-foreground/5 text-foreground/40 border-transparent"}`}
              >
                <p className={`text-[9px] font-black uppercase mb-1 ${isDeleting ? "text-white/60" : "text-foreground/40"}`}>Danger Zone</p>
                <div className="flex items-center gap-2">
                  <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">{isDeleting ? "Cancel" : "Delete"}</span>
                </div>
              </button>
            </div>

            {/* VIEW RENDERING LOGIC */}
            {isDeleting ? (
              /* DELETE CONFIRMATION SCREEN */
              <div className="bg-red-500/5 p-6 rounded-4xl border border-red-500/20 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle size={24} />
                  <h5 className="font-black uppercase text-xs tracking-widest">Permanent Deletion</h5>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                  You are about to remove <span className="text-foreground font-bold">{selectedUser.email}</span> from the system. This will wipe their transaction history and wallet. This cannot be undone.
                </p>
                <SubmitButton
                  onClick={handleDeleteUser}
                  isLoading={isSubmittingDelete}
                  idleText="Destroy Account Permanently"
                  loadingText="Destroying..."
                  className="bg-red-600 text-white h-14 rounded-2xl shadow-lg shadow-red-600/20 w-full font-black uppercase text-[11px] tracking-widest"
                />
              </div>
            ) : isFunding ? (
              /* FUNDING SCREEN */
              <div className="bg-brand-black p-6 rounded-4xl border border-white/5 space-y-4">
                <FormInput label="Amount to Credit" name="amount" type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} icon={Hash} placeholder="5000" />
                <SubmitButton
                  onClick={handleManualFunding}
                  isLoading={isSubmittingFund}
                  disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                  idleText={`Confirm Credit ₦${parseFloat(fundAmount || "0").toLocaleString()}`}
                  loadingText="Processing..."
                  className="bg-brand-red text-brand-burgundy h-14 rounded-2xl w-full"
                />
              </div>
            ) : (
              /* DEFAULT INFO VIEW */
              <>
                <div className="space-y-3 bg-foreground/2 p-4 rounded-3xl border border-foreground/5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-foreground/40 font-bold"><Mail size={14} /> Email</div>
                    <span className="font-black text-foreground lowercase">{selectedUser.email}</span>
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
                    <div className="flex items-center gap-2 text-foreground/40 font-bold"><Calendar size={14} /> Joined</div>
                        <span className="font-black text-foreground">{formatActivityDate(selectedUser.wallet?.created_at)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <FormSelect label="Account Authority" icon={ShieldAlert} options={statusOptions} selectedCode={selectedUser.status} 
                        onChange={(newStatus) => updateUserStatus(selectedUser.id, newStatus, () => setSelectedUser(null))} disabled={isUpdating} />
                  <SubmitButton isLoading={isUpdating} idleText="Update Status" loadingText="Updating..." className="bg-brand-red text-brand-burgundy h-14 rounded-2xl w-full" />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}