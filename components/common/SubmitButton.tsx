import React from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  disabled?: boolean;
  isLoading: boolean;
  idleText: string;
  loadingText: string;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  disabled,
  isLoading,
  idleText,
  loadingText,
  className = "",
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`
        w-full h-16 cursor-pointer rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 mt-4
        
        /* 1. Theme-Aware Base State: High contrast against the page bg */
        bg-foreground text-background 
        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]
        dark:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]

        /* 2. Hover State: Switch to your Brand Identity */
        hover:bg-brand-red hover:text-white 
        hover:shadow-brand-red/40 hover:-translate-y-1
        
        /* 3. Interactions & Constraints */
        active:scale-[0.98] 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
        
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" strokeWidth={3} size={22} />
          <span className="animate-pulse tracking-widest uppercase text-sm">{loadingText}</span>
        </div>
      ) : (
        <span className="tracking-tight">{idleText}</span>
      )}
    </button>
  );
};

export default SubmitButton;