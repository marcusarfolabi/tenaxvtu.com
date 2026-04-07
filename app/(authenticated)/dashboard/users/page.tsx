"use client";
import { useState } from "react";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User as UserIcon,
  Mail,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Trash2,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useUsers } from "@/hooks/useUser";
import FormSelect from "@/components/common/FormSelect";
import { walletApi } from "@/lib/api/wallet";
import { profileApi } from "@/lib/api/profile";
import { toast } from "react-hot-toast";
import FormInput from "@/components/common/FormInput";
import { formatCurrency } from "@/util/getUserCurrency";
import SubmitButton from "@/components/common/SubmitButton";
import { Modal } from "@/app/(authenticated)/account/components/ui/Modal";

const fundingTypeOptions = [
  { code: "credit", name: "Credit", fullname: "Add money to user wallet" },
  { code: "debit", name: "Debit", fullname: "Remove money from user wallet" },
];

export default function UserList({ limit = 10 }: { limit?: number }) {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { users, pagination, summary, isLoading, isUpdating, updateUserStatus, refreshUsers } =
    useUsers({ page, limit });

  const [isFunding, setIsFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundReference] = useState("");
  const [isSubmittingFund, setIsSubmittingFund] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [fundType, setFundType] = useState("credit");


  const handleManualFunding = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) return;
    setIsSubmittingFund(true);
    try {
      await walletApi.manualFunding({
        amount: fundAmount,
        type: fundType,
        reference: fundReference || `MAN-REF-${Date.now()}`,
        user_id: selectedUser.id,
      });

      toast.success(`${fundType === 'credit' ? 'Credited' : 'Debited'} ${formatCurrency(fundAmount)}`);
      setFundAmount("");
      setFundType("credit"); // Reset
      setIsFunding(false);
      setSelectedUser(null);
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
      setIsDeleting(false);
      setSelectedUser(null);
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
        <div className="h-40 bg-muted rounded-3xl w-full" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-20 bg-muted rounded-2xl" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-foreground p-8 rounded-[2.5rem] text-background shadow-xl relative overflow-hidden">
          <p className="text-background/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1"><Users size={14} /> Active Users</p>
          <h2 className="text-5xl font-black mb-4 tracking-tighter">{pagination.total}</h2>
        </div>

        <div className="grid grid-cols-3 md:col-span-3 gap-3">
          {[
            { label: "Verified Emails", val: summary?.total_verified_emails, icon: Mail, color: "text-green-500" },
            { label: "KYC Completed", val: summary?.total_kyc_completed, icon: ShieldCheck, color: "text-blue-500" },
            { label: "Virtual Accounts", val: summary?.total_with_virtual_accounts, icon: CreditCard, color: "text-purple-500" }
          ].map((item, idx) => (
            <div key={idx} className="bg-card border border-border p-4 rounded-3xl flex flex-col justify-between">
              <div className="flex justify-between">  <item.icon size={20} className={item.color} />
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{item.label}</p>
              </div>
              <h3 className="text-2xl font-black leading-none">{item.val || 0}</h3>

            </div>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-foreground uppercase text-[10px] tracking-[0.2em]">Ranked Users</h3>
          <TrendingUp size={14} className="text-muted-foreground" />
        </div>

        {users.map((user: any) => (
          <div
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setIsFunding(false);
              setIsDeleting(false);
            }}
            className="bg-card cursor-pointer p-4 rounded-3xl flex items-center justify-between border border-border shadow-sm hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-foreground">{user.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-muted-foreground lowercase truncate max-w-30">{user.email}</p>
                  {user.kyc_verified && <ShieldCheck size={10} className="text-blue-500" />}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-foreground">
                {formatCurrency(user.total_transaction_volume || 0)}
              </p>
              <p className="text-[8px] font-black text-muted-foreground uppercase">Volume</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-between bg-card p-2 rounded-2xl border border-border shadow-lg">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-20">
            <ChevronLeft size={20} />
          </button>
          <span className="text-[11px] font-black">{page} / {pagination.lastPage}</span>
          <button onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))} disabled={page === pagination.lastPage} className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-20">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Account Details">
        {selectedUser && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-foreground tracking-tight leading-tight">{selectedUser.name}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${selectedUser.email_verified ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-destructive border-destructive/20 bg-destructive/5"}`}>
                    {selectedUser.email_verified ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    Email {selectedUser.email_verified ? "Verified" : "Pending"}
                  </span>

                  <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${selectedUser.kyc_verified ? "text-blue-500 border-blue-500/20 bg-blue-500/5" : "text-orange-500 border-orange-500/20 bg-orange-500/5"}`}>
                    {selectedUser.kyc_verified ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                    Identity {selectedUser.kyc_verified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Virtual Account Info */}
            {selectedUser.virtual_account && (
              <div className="bg-muted/50 p-4 rounded-3xl border border-border">
                <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Assigned Virtual Account</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black">{selectedUser.virtual_account.bank_name}</p>
                    <p className="text-lg font-mono font-bold tracking-wider text-primary">{selectedUser.virtual_account.account_number}</p>
                  </div>
                  <CreditCard size={24} className="opacity-20" />
                </div>
              </div>
            )}
            {/* Wallet Info */}
            <div className="flex justify-between  gap-4">
              {selectedUser.wallet_balance !== undefined && (
                <div className="bg-muted/50 p-4 rounded-3xl border border-border w-full">
                  <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Wallet Bal</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(selectedUser.wallet_balance)}</p>
                </div>
              )}
              {/* Commission Info */}
              {selectedUser.commission_balance !== undefined && (
                <div className="bg-muted/50 p-4 rounded-3xl border border-border w-full">
                  <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Commission Bal</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(selectedUser.commission_balance)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setIsFunding(!isFunding); setIsDeleting(false); }}
                className={`p-4 rounded-3xl transition-all border flex flex-col items-start ${isFunding ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}
              >
                <p className="text-[9px] font-black uppercase mb-1 opacity-60">Wallet</p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} /> <span className="text-[10px] font-black uppercase">{isFunding ? "Cancel" : "Credit"}</span>
                </div>
              </button>

              <button
                onClick={() => { setIsDeleting(!isDeleting); setIsFunding(false); }}
                className={`p-4 rounded-3xl transition-all border flex flex-col items-start ${isDeleting ? "bg-destructive text-destructive-foreground border-destructive" : "bg-muted text-muted-foreground border-transparent"}`}
              >
                <p className="text-[9px] font-black uppercase mb-1 opacity-60">Danger</p>
                <div className="flex items-center gap-2">
                  <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">{isDeleting ? "Cancel" : "Delete"}</span>
                </div>
              </button>
            </div>

            {isDeleting ? (
              <div className="bg-destructive/5 p-6 rounded-3xl border border-destructive/20 space-y-4">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertTriangle size={24} />
                  <h5 className="font-black uppercase text-xs">Confirm Destruction</h5>
                </div>
                <p className="text-xs text-muted-foreground">Permanent deletion of <b>{selectedUser.email}</b>. This cannot be undone.</p>
                <SubmitButton
                  onClick={handleDeleteUser}
                  isLoading={isSubmittingDelete}
                  idleText="Destroy Account Permanently"
                  loadingText="Destroying..."
                  className="bg-brand-red text-white h-14 rounded-2xl shadow-lg shadow-red-600/20 w-full font-black uppercase text-[11px] tracking-widest"
                /> </div>
            ) : isFunding ? (
              <div className="bg-card p-6 rounded-3xl border border-border space-y-4">
                <FormSelect
                  label="Transaction Type"
                  icon={TrendingUp}
                  options={fundingTypeOptions}
                  selectedCode={fundType}
                  onChange={(val) => setFundType(val)}
                />

                <FormInput
                  label={`${fundType === 'credit' ? 'Credit' : 'Debit'} Amount`}
                  name="amount"
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  icon={Hash}
                />
                <SubmitButton
                  onClick={handleManualFunding}
                  isLoading={isSubmittingFund}
                  disabled={!fundAmount || formatCurrency(fundAmount) <= "0"}
                  idleText={`Confirm ${fundType === 'credit' ? 'Credit' : 'Debit'} ${formatCurrency(fundAmount || "0").toLocaleString()}`}
                  loadingText="Processing..."
                  className="bg-primary text-primary-foreground h-14 rounded-2xl w-full"
                /> </div>

            ) : (
              <div className="space-y-4 mb-4">
                <div className="bg-muted/30 p-4 rounded-3xl space-y-3">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Phone</span><span className="font-black">{selectedUser.phone}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Email</span><span className="font-black lowercase">{selectedUser.email}</span></div>
                </div>
                <FormSelect label="Account Status" icon={ShieldAlert} options={statusOptions} selectedCode={selectedUser.status}
                  onChange={(newStatus) => updateUserStatus(selectedUser.id, newStatus)} disabled={isUpdating} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}