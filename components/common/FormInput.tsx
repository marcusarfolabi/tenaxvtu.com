import React, { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
 
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
  labelClassName = "",
  ...props 
}) => {
  const isValidIcon = Icon && (typeof Icon === 'function' || typeof Icon === 'object');

  return (
    <div className="space-y-2">
      {label && (
        <label className={`label-primary block ${labelClassName}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          {...props}
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange} 
          className={`input-primary ${className}`}
        />

        {isValidIcon ? (
          <Icon 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none"
            size={20}
          />
        ) : (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-foreground/10 rounded-sm" />
        )}
      </div>
    </div>
  );
};

export default FormInput;