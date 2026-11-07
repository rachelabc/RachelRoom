import React, { useId } from 'react';
import { useDialog } from '../utils/useDialog';
import { soundEngine } from '../utils/soundEngine';

interface ModalWrapperProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  const handleClose = () => {
    soundEngine.playInspect();
    onClose();
  };

  const dialogRef = useDialog(handleClose);
  const titleId = useId();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        className={`relative w-full ${maxWidth} max-h-[90dvh] flex flex-col bg-[#fcf8f2] rounded-xl border-4 border-[#783e1c] shadow-2xl overflow-hidden`}
        style={{
          boxShadow: 'inset 0 0 0 2px #d59f63, inset 0 0 0 4px #4a2810, 0 10px 30px rgba(0,0,0,0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Brass corner studs */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />

        {/* Stardew-Style Header Banner */}
        <div className="flex items-center justify-between shrink-0 gap-3 px-4 py-3 bg-gradient-to-r from-[#8c5028] via-[#a36336] to-[#8c5028] border-b-4 border-[#5a3014] text-[#fff9f0]">
          <div className="min-w-0">
            <h2 id={titleId} className="font-pixel text-sm md:text-base font-bold tracking-wide drop-shadow-md">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#fef08a] mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={handleClose}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg bg-[#5a3014] hover:bg-[#783e1c] text-[#fef08a] border-2 border-[#d59f63] font-pixel text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="min-h-0 p-4 md:p-6 overflow-y-auto overscroll-contain space-y-5 text-[#4a3b32]">
          {children}
        </div>
      </div>
    </div>
  );
};
