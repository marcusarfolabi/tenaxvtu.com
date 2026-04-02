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
  labelClassName = "",
  placeholder = "Select an option...",
  disabled = false,
}) => {
  const selectedPlan = options.find(
    (p) => String(p.code) === String(selectedCode),
  );

  return (
    <div className="space-y-2">
      <label className={`label-primary block ${labelClassName}`}>
        {label}
      </label>

      <Listbox value={selectedCode} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button className={`input-primary relative text-left flex items-center pr-10 cursor-default ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span className="flex items-center gap-2 truncate font-bold">
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
                  <span className="text-foreground/40 font-normal">
                    {placeholder}
                  </span>
                )}
              </span>
            </span>

            {/* Left Icon - Themed */}
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <Icon className="text-foreground/50" size={20} />
            </span>

            {/* Right Chevron - Themed */}
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <ChevronDown className="text-foreground/40" size={18} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-60 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-background py-2 text-base shadow-2xl border border-foreground/10 focus:outline-none sm:text-sm">
              {options.length === 0 ? (
                <div className="py-4 px-4 text-foreground/50 text-center text-xs">
                  No options available.
                </div>
              ) : (
                options.map((option) => (
                  <Listbox.Option
                    key={option.code}
                    className={({ active }) =>
                      `relative cursor-default select-none py-3 pl-12 pr-4 transition-colors ${active
                        ? "bg-brand-red/10 text-brand-red"
                        : "text-foreground"
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
                          <span className={`block truncate ${selected ? "font-black" : "font-bold"}`}>
                            {option.name}
                          </span>
                          {option.fullname && (
                            <span className="text-[10px] text-foreground/60 truncate max-w-50">
                              {option.fullname}
                            </span>
                          )}
                          {option.reseller_price && (
                            <span className="text-[10px] text-brand-red font-bold">
                              ₦{parseFloat(String(option.reseller_price)).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-red">
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

      {selectedPlan?.fullname && (
        <p className="text-[9px] font-black text-foreground/60 capitalize px-2 tracking-tighter">
          Selected: {selectedPlan.fullname}
        </p>
      )}
    </div>
  );
};

export default FormSelect;