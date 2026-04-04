"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Database,
  Edit3,
  Search,
  Hash,
  Clock,
  Zap,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { dataApi } from "@/lib/api/data";
import { toast } from "react-hot-toast";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import { Modal } from "../../components/ui/Modal";
import { Switch } from "@headlessui/react";
import { formatCurrency } from "@/util/getUserCurrency";

// --- SKELETON COMPONENT ---
const PlanSkeleton = () => (
  <div className="p-6 md:px-8 md:py-4 animate-pulse">
    <div className="flex flex-col md:grid md:grid-cols-5 gap-4 items-center">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-10 h-10 rounded-xl bg-foreground/5 shrink-0" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-foreground/5 rounded" />
          <div className="h-2 w-12 bg-foreground/5 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 md:contents w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col md:items-center space-y-2">
            <div className="h-2 w-10 bg-foreground/5 rounded md:hidden" />
            <div className="h-3 w-16 bg-foreground/5 rounded" />
          </div>
        ))}
      </div>
      <div className="w-full md:w-auto flex justify-end">
        <div className="h-10 w-full md:w-28 bg-foreground/5 rounded-xl" />
      </div>
    </div>
  </div>
);

export default function PlanManagementPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  // Modal State
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newResellerPrice, setNewResellerPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPlans();
  }, []);

  // Reset pagination when search OR tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await dataApi.getPlans();
      const plansArray = Array.isArray(res.data) ? res.data : res.data.data;
      setPlans(plansArray || []);
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  };

  // --- GROUPING LOGIC ---
  const networks = useMemo(() => {
    const unique = Array.from(new Set(plans.map((p) => p.network.toUpperCase())));
    return ["ALL", ...unique.sort()];
  }, [plans]);

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.network.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab = activeTab === "ALL" || p.network.toUpperCase() === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [plans, searchTerm, activeTab]);

  const totalPages = Math.ceil(filteredPlans.length / pageSize);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, currentPage]);

  const openUpdateModal = (plan: any) => {
    setSelectedPlan(plan);
    setNewResellerPrice(plan.reseller_price);
    setIsEditModalOpen(true);
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsUpdating(true);
    try {
      await dataApi.updatePlan(selectedPlan.code, {
        reseller_price: newResellerPrice,
      });

      toast.success(`${selectedPlan.name} updated`);
      setIsEditModalOpen(false);

      setPlans((prev) =>
        prev.map((p) =>
          p.code === selectedPlan.code
            ? { ...p, reseller_price: newResellerPrice, status: 'active' }
            : p,
        ),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (plan: any) => {
    setIsToggling(plan.code);
    try {
      await dataApi.toggleStatus(plan.code);
      toast.success(
        `${plan.name} is now ${plan.status === "active" ? "inactive" : "active"}`,
      );

      setPlans((prev) =>
        prev.map((p) =>
          p.code === plan.code
            ? { ...p, status: p.status === "active" ? "inactive" : "active" }
            : p,
        ),
      );
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background p-6 rounded-[2.5rem] border border-foreground/5 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">
            Plan Management
          </h1>
          <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
            Adjust Agent Commissions
          </p>
        </div>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
            size={18}
          />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-foreground/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-red w-full md:w-64 text-sm font-medium"
          />
        </div>
      </div>

      {/* --- NETWORK TABS --- */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {networks.map((net) => (
          <button
            key={net}
            onClick={() => setActiveTab(net)}
            className={`px-6 py-2.5 cursor-pointer rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === net
              ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20"
              : "bg-background border-foreground/10 text-foreground/40 hover:border-brand-red/40"
              }`}
          >
            {net}
          </button>
        ))}
      </div>

      {/* Responsive Table/Stack */}
      <div className="bg-background rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-xl">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-5 bg-foreground/2 px-8 py-4 border-b border-foreground/5">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40">
            Network & Name
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 text-center">
            API Price
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 text-center">
            Selling Price
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 text-center">
            Allowance
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 text-right">
            Action
          </span>
        </div>

        <div className="divide-y divide-foreground/5">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <PlanSkeleton key={i} />)
          ) : paginatedPlans.length > 0 ? (
            paginatedPlans.map((plan) => (
              <div
                key={plan.code}
                className="group p-6 md:px-8 md:py-4 transition-colors hover:bg-foreground/1"
              >
                <div className="flex flex-col md:grid md:grid-cols-5 gap-4 items-center">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                      <Database size={20} className="text-brand-red" />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none">
                        {plan.name}
                      </p>
                      <span className="text-[10px] font-black text-brand-red uppercase">
                        {plan.network}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:contents w-full">
                    <div className="flex flex-col md:items-center">
                      <span className="md:hidden text-[9px] font-black text-foreground/30 uppercase">
                        API
                      </span>
                      <p className="text-sm font-bold text-foreground">
                        {formatCurrency(plan.price)}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className="md:hidden text-[9px] font-black text-foreground/30 uppercase">
                        Selling Cost
                      </span>
                      <p className="text-sm font-black text-brand-red">
                        {formatCurrency(plan.reseller_price)}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-center text-right md:text-center">
                      <span className="md:hidden text-[9px] font-black text-foreground/30 uppercase">
                        Plan
                      </span>
                      <p className="text-xs font-bold text-foreground/60 leading-tight">
                        {plan.allowance}
                        <br className="hidden md:block" />
                        <span className="md:text-[10px] opacity-70">
                          ({plan.validity})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={plan.status === "active"}
                        onChange={() => handleToggleStatus(plan)}
                        disabled={isToggling === plan.code}
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-foreground/10 transition-colors duration-200 ease-in-out focus:outline-none data-checked:bg-green-500 data-disabled:opacity-50 data-disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Toggle Status</span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none flex size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5 items-center justify-center"
                        >
                          {isToggling === plan.code ? (
                            <Loader2
                              size={10}
                              className="animate-spin text-green-600"
                            />
                          ) : (
                            <div
                              className={`size-1 rounded-full ${plan.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                            />
                          )}
                        </span>
                      </Switch>

                      <span
                        className={`text-[9px] font-black uppercase tracking-widest ${plan.status === "active" ? "text-green-500" : "text-red-500"}`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    <button
                      onClick={() => openUpdateModal(plan)}
                      className="w-full cursor-pointer md:w-auto flex items-center justify-center gap-2 bg-foreground/5 hover:bg-brand-red hover:text-brand-burgundy p-2.5 rounded-xl transition-all font-bold text-xs"
                    >
                      <Edit3 size={14} /> Update Price
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <p className="text-foreground/40 font-bold text-sm">
                No plans found matching your selection.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-foreground/2 px-8 py-4 flex items-center justify-between border-t border-foreground/5">
            <p className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-foreground/5 disabled:opacity-20 transition-all cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    totalPages > 5 &&
                    Math.abs(pageNum - currentPage) > 1 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages
                  )
                    return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all cursor-pointer ${currentPage === pageNum
                        ? "bg-brand-red text-brand-burgundy shadow-lg shadow-brand-red/20"
                        : "hover:bg-foreground/5 text-foreground/40"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-foreground/5 disabled:opacity-20 transition-all cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Plan Price"
      >
        <form onSubmit={handleUpdatePrice} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-foreground/5 p-4 rounded-2xl border border-foreground/5">
              <div className="flex items-center gap-2 text-foreground/40 mb-1">
                <Hash size={12} />
                <span className="text-[9px] font-black uppercase">
                  Selling Price
                </span>
              </div>
              <p className="text-lg font-black tracking-tight">
                {formatCurrency(selectedPlan?.price || "0")}
              </p>
            </div>
            <div className="bg-foreground/5 p-4 rounded-2xl border border-foreground/5">
              <div className="flex items-center gap-2 text-foreground/40 mb-1">
                <Clock size={12} />
                <span className="text-[9px] font-black uppercase">
                  Validity
                </span>
              </div>
              <p className="text-sm font-bold">
                {selectedPlan?.validity || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-brand-red/5 p-4 rounded-2xl border border-brand-red/10 flex items-center gap-4">
            <div className="p-2 bg-brand-red/20 rounded-lg text-brand-red">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-brand-red/60">
                Selected Plan
              </p>
              <p className="text-sm font-bold">
                {selectedPlan?.name} ({selectedPlan?.allowance})
              </p>
            </div>
          </div>

          <FormInput
            label="New Reseller Price (NGN)"
            name="reseller_price"
            type="number"
            value={newResellerPrice}
            onChange={(e) => setNewResellerPrice(e.target.value)}
            placeholder="Enter amount for agents"
            icon={Edit3}
            required
          />

          <SubmitButton
            loadingText="Saving new price..."
            isLoading={isUpdating}
            idleText="Save New Pricing"
            className="h-14 rounded-2xl"
          />
        </form>
      </Modal>
    </div>
  );
}