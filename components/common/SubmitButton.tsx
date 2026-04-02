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
        w-full h-16 cursor-pointer rounded-2xl font-black text-lg transition-all shadow-xl mt-4 flex items-center justify-center gap-2 
        active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed 
        hover:bg-brand-red hover:text-brand-burgundy 
        hover:shadow-brand-red/20 hover:-translate-y-0.5
        
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={22} />
          <span className="animate-pulse">{loadingText}</span>
        </div>
      ) : (
        <span>{idleText}</span>
      )}
    </button>
  );
};

export default SubmitButton;
