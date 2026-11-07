import React from 'react';
import { PORTRAIT_IMAGE } from '../data/portfolioData';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#fcf8f2] rounded-2xl border-4 border-[#783e1c] shadow-2xl p-6 text-[#4a3b32] space-y-4 text-center"
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
            className="absolute top-3 right-3 text-[#783e1c] hover:text-[#451a03] font-pixel text-xs p-1 rounded cursor-pointer"
            aria-label="Close instructions"
          >
            ✕
          </button>
        )}

        {/* Character Portrait */}
        <div className="flex justify-center">
          <img
            src={PORTRAIT_IMAGE}
            alt="Rachel Li"
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-xl border-3 border-[#783e1c] object-cover pixelated shadow-md"
          />
        </div>

        {/* Exact concise wording requested by user */}
        <div className="space-y-2">
          <h1 className="font-pixel text-base sm:text-lg font-bold text-[#451a03]">
            Welcome to Rachel Li's bedroom!
          </h1>
          <p className="text-xs sm:text-sm text-[#78350f] leading-relaxed max-w-sm mx-auto font-sans">
            Please use the arrow buttons to move the avatar around and explore the areas of the room!
          </p>
          <p className="text-[11px] text-[#9a3412] font-pixel">
            (WASD / Arrow Keys / Click floor to move · [E] to interact)
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
