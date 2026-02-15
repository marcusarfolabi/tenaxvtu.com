import React, { useState, InputHTMLAttributes } from 'react';
import { Lock, Eye, EyeOff, LucideIcon } from 'lucide-react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon | any;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label, 
  icon: Icon = Lock, 
  className = "", 
  children, 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2"> 
      <label className="label-primary block">
        {label}
      </label>
      
      <div className="relative">
        <input 
          {...props}
          type={showPassword ? "text" : "password"}  
          className={`input-primary pr-12 ${className}`}
        />
        
        <Icon 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none" 
          size={20} 
        /> 
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-brand-gold transition-colors z-10 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
       
      {children} 
    </div>
  );
};