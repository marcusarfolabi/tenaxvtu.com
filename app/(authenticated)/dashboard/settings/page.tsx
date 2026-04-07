"use client";

import { useState, useEffect } from "react";
import { Percent, Zap, Monitor, PhoneCall, Loader2, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import { tenantApi, TenantInfo } from "@/lib/api/tenant";

export default function TenantSettingsPage() {
    const [commissionData, setCommissionData] = useState<TenantInfo>({
        airtime_commission: "",
        data_commission: "",
        cable_tv_commission: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. Fetch existing settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await tenantApi.getTenantInfo();
                // Assuming your API returns { data: { airtime_commission: "1.5", ... } }
                const settings = response.data.data;
                setCommissionData({
                    airtime_commission: settings.airtime_commission?.toString() || "0",
                    data_commission: settings.data_commission?.toString() || "0",
                    cable_tv_commission: settings.cable_tv_commission?.toString() || "0",
                });
            } catch (error: any) {
                toast.error("Failed to load tenant settings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();

        // Quick validation to prevent negative values
        if (Object.values(commissionData).some(val => parseFloat(val || "0") < 0)) {
            return toast.error("Commission rates cannot be negative");
        }

        setIsUpdating(true);
        try {
            await tenantApi.updateTenant(commissionData);
            toast.success("Commissions updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24 px-1">
            <div className="px-1">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                    Commission Configuration
                </h1>
                <p className="text-foreground/50 text-sm font-medium">
                    Global profit margins for airtime, data, and cable subscriptions.
                </p>
            </div>

            <section className="bg-background rounded-[2.5rem] p-6 sm:p-8 border border-foreground/5 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Percent size={24} />
                    </div>
                    <div>
                        <h2 className="font-black text-foreground uppercase text-xs tracking-widest">
                            Commission Percentages
                        </h2>
                        <p className="text-[10px] text-foreground/40 font-bold uppercase">
                            Applied to every successful transaction
                        </p>
                    </div>
                </div>

                <form onSubmit={handleUpdateSettings} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormInput
                            label="Airtime (%)"
                            name="airtime_commission"
                            type="number"
                            step="0.01"
                            min="0"
                            value={commissionData.airtime_commission}
                            onChange={(e) => setCommissionData({ ...commissionData, airtime_commission: e.target.value })}
                            icon={PhoneCall}
                            placeholder="0.00"
                        />

                        <FormInput
                            label="Data (%)"
                            name="data_commission"
                            type="number"
                            step="0.01"
                            min="0"
                            value={commissionData.data_commission}
                            onChange={(e) => setCommissionData({ ...commissionData, data_commission: e.target.value })}
                            icon={Zap}
                            placeholder="0.00"
                        />

                        <FormInput
                            label="Cable TV (%)"
                            name="cable_tv_commission"
                            type="number"
                            step="0.01"
                            min="0"
                            value={commissionData.cable_tv_commission}
                            onChange={(e) => setCommissionData({ ...commissionData, cable_tv_commission: e.target.value })}
                            icon={Monitor}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="bg-muted/30 p-5 rounded-[2rem] border border-border/50 flex gap-4">
                        <div className="mt-1 text-primary"><Info size={18} /></div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                            <b>Important:</b> These values are treated as percentages. For example, entering <b>1.5</b> will calculate a 1.5% commission on the total transaction amount. Changes take effect immediately for all subsequent orders.
                        </p>
                    </div>

                    <SubmitButton
                        isLoading={isUpdating}
                        idleText="Update Settings"
                        loadingText="Saving Changes..."
                        className="h-14 rounded-2xl shadow-xl shadow-primary/20 w-full md:w-auto md:px-12"
                    />
                </form>
            </section>
        </div>
    );
}