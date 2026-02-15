import React, { useState, InputHTMLAttributes } from 'react';
import { Lock, Eye, EyeOff, LucideIcon } from 'lucide-react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon | any;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label, icon: Icon = Lock, className, children, ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="label-primary text-sm font-bold text-brand-black">{label}</label>
      <div className="relative">
        <input 
          {...props}
          type={showPassword ? "text" : "password"} 
          className={`input-primary text-gray-500 pl-12 pr-12 w-full h-14 rounded-xl border border-gray-200 focus:border-brand-gold outline-none transition-all ${className}`}
        />
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black" size={20} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black hover:text-brand-gold z-10"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {children} 
    </div>
  );
};