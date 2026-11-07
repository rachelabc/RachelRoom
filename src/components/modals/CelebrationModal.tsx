import React from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { Sparkles, Star, CheckCircle, Heart, Coffee, BookOpen, Bed } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface CelebrationModalProps {
  onClose: () => void;
  onOpenStarJar: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ onClose, onOpenStarJar }) => {
  return (
    <ModalWrapper
      title="🎉 Yay! You've Explored Rachel's Room! 🎉"
      subtitle="All 5 Room Stops Discovered · Special Keepsake Ready"
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-[#4a3b32] text-center sm:text-left">
        {/* Celebration Banner */}
        <div className="p-4 bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fed7aa] rounded-xl border-2 border-[#d97706] shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#581c87] text-[#fef08a] flex items-center justify-center shrink-0 border-2 border-[#a855f7] shadow-md text-2xl">
            ✨
          </div>
          <div className="space-y-1">
            <span className="font-pixel text-xs bg-[#78350f] text-[#fef08a] px-2 py-0.5 rounded-full inline-block">
              TOUR COMPLETE 100%
            </span>
            <h3 className="font-pixel text-sm sm:text-base font-bold text-[#451a03]">
              Thank You for Visiting My Little World!
            </h3>
            <p className="text-xs text-[#78350f] leading-relaxed">
              You've discovered all 5 corners of Rachel Li's cozy room—from her Berkeley desk and POPMART figurines to the cozy bed, boba break, and paper star jar.
            </p>
          </div>
        </div>

        {/* 5 Discovered Badges Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
          <div className="p-2.5 bg-[#f5eeff] rounded-lg border border-[#d8b4fe] flex items-center gap-2">
            <span className="text-xs">1. 🛏️</span>
            <span className="text-xs font-pixel text-[#581c87] font-semibold">Cozy Bed</span>
          </div>
          <div className="p-2.5 bg-[#fefce8] rounded-lg border border-[#fde047] flex items-center gap-2">
            <span className="text-xs">2. 🚪</span>
            <span className="text-xs font-pixel text-[#854d0e] font-semibold">Boba Door</span>
          </div>
          <div className="p-2.5 bg-[#f0fdf4] rounded-lg border border-[#86efac] flex items-center gap-2">
            <span className="text-xs">3. 🧸</span>
            <span className="text-xs font-pixel text-[#166534] font-semibold">POPMART Shelf</span>
          </div>
          <div className="p-2.5 bg-[#e0f2fe] rounded-lg border border-[#7dd3fc] flex items-center gap-2">
            <span className="text-xs">4. 💻</span>
            <span className="text-xs font-pixel text-[#0369a1] font-semibold">My Desk & Cal</span>
          </div>
          <div className="p-2.5 bg-[#fdf2f8] rounded-lg border border-[#fbcfe8] flex items-center gap-2">
            <span className="text-xs">5. ⭐</span>
            <span className="text-xs font-pixel text-[#9d174d] font-semibold">Paper Star Jar</span>
          </div>
        </div>

        {/* Action Buttons: Fold a star or keep exploring */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => {
              soundEngine.playFanfare();
              onOpenStarJar();
            }}
            className="w-full sm:flex-1 pixel-wood-button py-2.5 px-4 rounded-xl font-pixel text-xs font-bold tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 fill-current text-yellow-300" />
            Fold a Paper Star for the Jar ⭐
          </button>

          <button
            onClick={() => {
              soundEngine.playInspect();
              onClose();
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-pixel text-xs bg-white text-[#78350f] border-2 border-[#d59f63] hover:bg-[#fef9f0] cursor-pointer"
          >
            Keep Exploring Room
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
