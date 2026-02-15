import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  disabled?:boolean;
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
  className = "" 
}) => {
  return (
    <button 
      type="submit"
      disabled={isLoading || disabled}
      className={`
        w-full h-16 cursor-pointer rounded-2xl font-black text-lg transition-all shadow-xl shadow-black/5 mt-4 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
        bg-brand-black text-white 
        hover:bg-brand-gold hover:text-brand-black
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          {loadingText}
        </>
      ) : (
        idleText
      )}
    </button>
  );
};

export default SubmitButton;