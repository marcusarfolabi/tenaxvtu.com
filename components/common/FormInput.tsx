import React, { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * We extend InputHTMLAttributes so the component can accept all standard HTML props
 * like inputMode, autoComplete, pattern, onFocus, etc., automatically.
 */
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon: LucideIcon | any;
  labelClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = true,
  className = "",
  labelClassName = "text-brand-black",
  ...props 
}) => {
  const isValidIcon = Icon && (typeof Icon === 'function' || typeof Icon === 'object');
  return (
    <div className="space-y-2">
      <label className={`label-primary text-sm font-bold block ${labelClassName}`}>
        {label}
      </label>
      <div className="relative">
        <input
          {...props} // Spreads inputMode, autoComplete, pattern, etc.
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`input-primary text-gray-500 pl-12 w-full h-14 rounded-xl border border-gray-200 focus:border-brand-gold outline-none transition-all placeholder:text-gray-300 ${className}`}
        />
        {isValidIcon ? (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black pointer-events-none"
            size={20}
          />
        ) : (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-100 rounded-sm" />
        )}
      </div>
    </div>
  );
};

export default FormInput;