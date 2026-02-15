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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-[2px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }} // Start off-screen
            animate={{ y: 0 }}      // Slide up
            exit={{ y: "100%" }}    // Slide down on close
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"                // Enable vertical drag
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              // If dragged down more than 100px, close it
              if (info.offset.y > 100) onClose();
            }}
            className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden touch-none"
          >
            {/* Draggable Handle Area */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {title && (
              <div className="px-6 pt-2 pb-1 text-center">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {title}
                </h3>
              </div>
            )}

            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar pb-10 px-1">
              {/* Added a slight wrapper to ensure children don't interfere with drag */}
              <div className="touch-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}