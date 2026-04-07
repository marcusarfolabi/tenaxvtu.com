"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="relative w-full max-w-md bg-background border-t sm:border border-foreground/5 rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden touch-none transition-colors duration-300"
          >
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-foreground/10 rounded-full" />
            </div>

            {title && (
              <div className="px-6 pt-2 pb-1 text-center">
                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                  {title}
                </h3>
              </div>
            )}

            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar pb-10 px-4">
              <div className="touch-auto text-foreground">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}