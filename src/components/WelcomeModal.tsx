import React, { useId } from 'react';
import { useDialog } from '../utils/useDialog';
import { soundEngine } from '../utils/soundEngine';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  onStart: () => void;
  onClose?: () => void;
  onResetProgress?: () => void;
  isRevisit?: boolean;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ 
  onStart, 
  onClose,
  onResetProgress,
  isRevisit = false
}) => {
  const handleStart = () => {
    soundEngine.playFanfare();
    soundEngine.startBGM();
    onStart();
  };

  const dialogRef = useDialog(onClose ?? onStart);
  const titleId = useId();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        className="relative max-h-[90dvh] overflow-y-auto overscroll-contain w-full max-w-md bg-[#fcf8f2] rounded-2xl border-4 border-[#783e1c] shadow-2xl p-4 sm:p-6 text-[#4a3b32] space-y-4 text-center"
        style={{
          boxShadow: 'inset 0 0 0 2px #d59f63, inset 0 0 0 4px #4a2810, 0 16px 40px rgba(0,0,0,0.6)'
        }}
      >
        {/* Brass corner studs */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f]" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f]" />

        {/* Optional close X button if revisiting */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-1 right-1 w-11 h-11 text-[#783e1c] hover:text-[#451a03] font-pixel text-xs p-1 rounded cursor-pointer"
            aria-label="Close instructions"
          >
            ✕
          </button>
        )}

        {/* Clean Header & Exact User Copy (No picture) */}
        <div className="space-y-3 pt-8">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#fde047] text-[#78350f] font-pixel text-xs font-bold border border-[#b45309] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            MY LITTLE WORLD · CAL MDes '27 🐻
          </div>

          <h1 id={titleId} className="font-pixel text-base sm:text-lg font-bold text-[#451a03] leading-snug">
            Welcome to Rachel Li's bedroom!
          </h1>

          <p className="md:hidden text-sm text-[#78350f] leading-relaxed font-sans">
            Tap a room object or a destination below to explore. Tap the floor or use the arrow buttons to move Rachel.
          </p>
          <p className="hidden md:block text-sm text-[#78350f] leading-relaxed font-sans">
            Click a room object or a destination below to explore. Use WASD / Arrow Keys or click the floor to move; press E to interact nearby.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleStart}
            className="w-full pixel-wood-button py-3 px-6 rounded-xl font-pixel text-xs sm:text-sm font-bold tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            {isRevisit ? 'Resume Exploration' : 'Enter Bedroom'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {isRevisit && onResetProgress && (
            <button
              onClick={onResetProgress}
              className="w-full py-2 px-4 rounded-xl font-pixel text-[11px] text-[#b45309] hover:bg-[#fed7aa]/50 border border-[#f97316]/40 cursor-pointer transition-colors"
            >
              🔄 Reset Exploration Progress (0/5)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
