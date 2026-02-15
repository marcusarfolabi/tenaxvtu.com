"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { ChevronDown, Check, ArrowRightLeft, X } from "lucide-react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: {
    commission: string | number;
    currency: string;
  };
  onTransfer: (type: "commission") => void;
  isPending: boolean;
}

export function TransferModal({
  isOpen,
  onClose,
  balances,
  onTransfer,
  isPending,
}: TransferModalProps) {
  const options = [
    { id: "commission", name: "Commission", value: balances.commission },
  ];

  const [selected, setSelected] = useState(options[0]);

  const format = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return `${balances.currency}${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-4xl bg-brand-black border border-white/10 p-8 text-left align-middle shadow-2xl transition-all">
                <div className="flex justify-between items-center mb-8">
                  <Dialog.Title className="text-xl font-black text-white flex items-center gap-3">
                    <div className="p-2 bg-brand-gold/10 rounded-xl">
                      <ArrowRightLeft className="text-brand-gold" size={20} />
                    </div>
                    Transfer to Main
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 text-white/20 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-3 block ml-1">
                      Select Source
                    </label>
                    <Listbox value={selected} onChange={setSelected}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-white/5 py-4 pl-5 pr-10 text-left text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all">
                          <span className="block truncate font-bold text-sm">
                            {selected.name}
                          </span>
                          <span className="block text-xs text-brand-gold font-black mt-0.5">
                            {format(selected.value)}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <ChevronDown className="h-5 w-5 text-white/20" />
                          </span>
                        </Listbox.Button>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-zinc-900 border border-white/10 p-2 shadow-2xl z-20 outline-none">
                            {options.map((opt) => (
                              <Listbox.Option
                                key={opt.id}
                                value={opt}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-3.5 pl-11 pr-4 rounded-xl transition-all mb-1 last:mb-0 ${
                                    active
                                      ? "bg-brand-gold text-brand-black"
                                      : "text-white/70"
                                  }`
                                }
                              >
                                {({ selected: isSelected }) => (
                                  <>
                                    <span
                                      className={`block truncate font-bold ${isSelected ? "text-brand-black" : "text-white"}`}
                                    >
                                      {opt.name}
                                    </span>
                                    <span
                                      className={`text-[10px] block font-black ${isSelected ? "text-brand-black/60" : "text-brand-gold"}`}
                                    >
                                      {format(opt.value)}
                                    </span>
                                    {isSelected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-brand-black">
                                        <Check
                                          className="h-4 w-4"
                                          strokeWidth={3}
                                        />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={
                        isPending || parseFloat(selected.value.toString()) <= 0
                      }
                      onClick={() => onTransfer(selected.id as any)}
                      className="w-full cursor-pointer bg-brand-gold text-brand-black py-4 rounded-2xl font-black uppercase tracking-tight shadow-lg shadow-brand-gold/10 hover:shadow-brand-gold/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Transfer ${selected.name}`
                      )}
                    </button>

                    <p className="text-center text-[9px] text-white/20 uppercase font-bold mt-4 tracking-widest">
                      Funds will be moved to your main wallet
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}