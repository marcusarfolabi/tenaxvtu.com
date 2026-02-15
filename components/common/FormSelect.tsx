import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { LucideIcon, ChevronDown, Check } from "lucide-react";
import Image from "next/image";

interface Option {
  code: string | number;
  name: string;
  reseller_price?: string | number;
  allowance?: string;
  image?: string;
  fullname?: string;
}

interface FormSelectProps {
  label: string;
  icon: LucideIcon | any;
  options: Option[];
  selectedCode: string;
  onChange: (code: string) => void;
  labelClassName?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  icon: Icon,
  options,
  selectedCode,
  onChange,
  labelClassName = "text-brand-black",
  placeholder = "Select an option...",
  // diabled,
}) => {
  const selectedPlan = options.find(
    (p) => String(p.code) === String(selectedCode),
  );

  return (
    <div className="space-y-2">
      <label
        className={`text-[10px] font-black uppercase tracking-widest px-1 ${labelClassName}`}
      >
        {label}
      </label>

      <Listbox value={selectedCode} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full h-14 cursor-default rounded-2xl bg-gray-50 pl-12 pr-10 text-left border border-gray-100 focus:outline-none focus:border-brand-gold transition-all sm:text-sm">
            <span className="flex items-center gap-2 truncate font-bold text-gray-900">
              {selectedPlan?.image && (
                <Image
                  width={20}
                  height={20}
                  src={selectedPlan.image}
                  alt=""
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="truncate">
                {selectedPlan ? (
                  `${selectedPlan.name} ${selectedPlan.reseller_price ? `— ₦${parseFloat(String(selectedPlan.reseller_price)).toLocaleString()}` : ""}`
                ) : (
                  <span className="text-gray-400 font-normal">
                    {placeholder}
                  </span>
                )}
              </span>
            </span>

            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Icon className="text-gray-400" size={20} />
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <ChevronDown className="text-gray-400" size={18} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-60 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 text-base shadow-2xl border border-gray-100 focus:outline-none sm:text-sm">
              {options.length === 0 ? (
                <div className="py-4 px-4 text-gray-500 text-center text-xs">
                  No options available.
                </div>
              ) : (
                options.map((option) => (
                  <Listbox.Option
                    key={option.code}
                    className={({ active }) =>
                      `relative cursor-default select-none py-3 pl-12 pr-4 transition-colors ${
                        active
                          ? "bg-brand-gold/10 text-brand-black"
                          : "text-gray-900"
                      }`
                    }
                    value={option.code}
                  >
                    {({ selected }) => (
                      <div className="flex items-center gap-3">
                        {option.image && (
                          <Image
                            width={24}
                            height={24}
                            src={option.image}
                            alt=""
                            className="w-6 h-6 object-contain rounded-md"
                          />
                        )}
                        <div className="flex flex-col">
                          <span
                            className={`block truncate ${selected ? "font-black" : "font-bold"}`}
                          >
                            {option.name}
                          </span>
                          {option.fullname && (
                            <span className="text-[10px] text-gray-400 truncate max-w-50">
                              {option.fullname}
                            </span>
                          )}
                          {option.reseller_price && (
                            <span className="text-[10px] text-brand-gold font-bold">
                              ₦
                              {parseFloat(
                                String(option.reseller_price),
                              ).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-gold">
                            <Check size={18} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {/* Visual confirmation below the select */}
      {selectedPlan?.fullname && (
        <p className="text-[9px] font-black text-gray-600 capitalize px-2 tracking-tighter">
          Selected: {selectedPlan.fullname}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
