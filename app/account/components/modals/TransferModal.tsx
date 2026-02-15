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

export function TransferModal({ isOpen, onClose, balances, onTransfer, isPending }: TransferModalProps) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-brand-black border border-white/10 p-6 text-left align-middle shadow-2xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-black text-white flex items-center gap-2">
                    <ArrowRightLeft className="text-brand-gold" size={24} />
                    Transfer to Main
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                      Select Source
                    </label>
                    <Listbox value={selected} onChange={setSelected}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-2xl bg-white/5 py-4 pl-4 pr-10 text-left text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold">
                          <span className="block truncate font-bold">{selected.name}</span>
                          <span className="block text-xs text-brand-gold">{format(selected.value)}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-zinc-900 border border-white/10 p-1 shadow-2xl z-20">
                            {options.map((opt) => (
                              <Listbox.Option
                                key={opt.id}
                                value={opt}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-3 pl-10 pr-4 rounded-xl transition-colors ${
                                    active ? "bg-brand-gold text-brand-black" : "text-gray-300"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate font-bold ${selected ? "text-white" : ""}`}>
                                      {opt.name}
                                    </span>
                                    <span className="text-[10px] block opacity-80">{format(opt.value)}</span>
                                    {selected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Check className="h-5 w-5" />
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

                  <button
                    disabled={isPending || parseFloat(selected.value.toString()) <= 0}
                    onClick={() => onTransfer(selected.id as any)}
                    className="w-full cursor-pointer bg-brand-gold text-brand-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Processing..." : `Transfer ${selected.name} to Balance`}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}