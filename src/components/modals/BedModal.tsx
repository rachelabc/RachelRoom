import React, { useState, useEffect } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { Moon, Sparkles, Heart, Clock, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface BedModalProps {
  onClose: () => void;
  onNapStart?: () => void;
  onNapEnd?: () => void;
}

export const BedModal: React.FC<BedModalProps> = ({ onClose, onNapStart, onNapEnd }) => {
  const [isNapping, setIsNapping] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(20);
  const [napDone, setNapDone] = useState<boolean>(false);

  const startNap = () => {
    soundEngine.playInspect();
    if (onNapStart) onNapStart();
    onClose();
  };

  const cancelNap = () => {
    setIsNapping(false);
    if (onNapEnd) onNapEnd();
  };

  useEffect(() => {
    if (!isNapping) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      soundEngine.playFanfare();
      setIsNapping(false);
      setNapDone(true);
      if (onNapEnd) onNapEnd();
    }
  }, [isNapping, countdown, onNapEnd]);

  return (
    <ModalWrapper
      title="The Cozy Bed Nook"
      subtitle="Cat-Pattern Blanket · One Fluffy Pillow · Rachel's Sacred Rest Space"
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <div className="space-y-3.5 text-[#4a3b32]">
        {/* 1. Bedtime & Night Owl Schedule */}
        <div className="p-3.5 bg-[#f5eeff] rounded-xl border-2 border-[#d8b4fe] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#581c87] text-[#fef08a] flex items-center justify-center shrink-0 shadow-xs border border-[#a855f7]">
              <Moon className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs font-bold text-[#4c1d95]">
                  Rachel's Bedtime
                </span>
                <span className="text-[10px] font-pixel bg-[#eedbff] text-[#6b21a8] px-2 py-0.5 rounded-full border border-[#c084fc]">
                  Night Owl 🌙
                </span>
              </div>
              <p className="text-xs text-[#581c87] mt-0.5 font-medium">
                Usually <strong>1:00 AM – 2:00 AM</strong> (late night coding, reading, and listening to lo-fi).
              </p>
            </div>
          </div>
          <Clock className="w-4 h-4 text-[#a855f7] shrink-0 hidden sm:block" />
        </div>

        {/* 2. Stuffed Animal Companions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Broccoli Plushie */}
          <div className="p-3.5 bg-[#f0fdf4] rounded-xl border-2 border-[#86efac] flex items-start gap-3 shadow-xs">
            <span className="text-2xl p-1.5 bg-white rounded-lg border border-[#bbf7d0] shadow-xs shrink-0">
              🥦
            </span>
            <div className="space-y-0.5">
              <h4 className="font-pixel text-xs font-bold text-[#14532d]">
                Broccoli Plushie
              </h4>
              <p className="text-xs text-[#166534] leading-relaxed">
                Gifted by her <strong>mom on her 18th birthday</strong>. A heartwarming comfort piece that travels everywhere with her!
              </p>
            </div>
          </div>

          {/* Turtle Plushie */}
          <div className="p-3.5 bg-[#fefce8] rounded-xl border-2 border-[#fde047] flex items-start gap-3 shadow-xs">
            <span className="text-2xl p-1.5 bg-white rounded-lg border border-[#fef08a] shadow-xs shrink-0">
              🐢
            </span>
            <div className="space-y-0.5">
              <h4 className="font-pixel text-xs font-bold text-[#713f12]">
                Turtle Plushie
              </h4>
              <p className="text-xs text-[#854d0e] leading-relaxed">
                Bought it herself to celebrate receiving her <strong>Master's degree offer</strong>! A proud symbol of hard work.
              </p>
            </div>
          </div>
        </div>

        {/* 3. The Cozy Challenge */}
        <div className="p-3 bg-[#fff1f2] rounded-xl border border-[#fecdd3] flex items-center gap-2.5 text-xs text-[#9f1239]">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <p className="leading-snug">
            <strong>Daily Challenge:</strong> The bed and cat-patterned blankets are so wonderfully warm and cozy that she has serious trouble getting up in the morning! 🥱🛌
          </p>
        </div>

        {/* 4. Interactive 20-Second Cozy Nap */}
        <div className="p-4 bg-gradient-to-r from-[#faf5ff] to-[#fdf2f8] rounded-xl border-2 border-[#c084fc] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-pixel text-xs font-bold text-[#581c87]">
                Cozy 20-Second Power Nap
              </span>
            </div>
            {isNapping && (
              <span className="font-pixel text-xs text-[#7e22ce] animate-pulse">
                Snoozing: {countdown}s remaining... 💤
              </span>
            )}
            {napDone && !isNapping && (
              <span className="font-pixel text-xs text-emerald-600 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-current text-emerald-500" />
                Fully Refreshed! (100%)
              </span>
            )}
          </div>

          {/* Progress bar during nap */}
          {isNapping && (
            <div className="w-full bg-[#e9d5ff] h-3 rounded-full overflow-hidden border border-[#c084fc]">
              <div
                className="bg-gradient-to-r from-[#c084fc] to-[#f472b6] h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((20 - countdown) / 20) * 100}%` }}
              />
            </div>
          )}

          <p className="text-xs text-[#6b21a8] leading-relaxed">
            {isNapping
              ? "Tucking under the cat blankets... Soft breathing, dim ambient light, and cozy dreams. Zzz..."
              : "Need a moment to recharge? Take a relaxing 20-second power nap right here on the bed!"}
          </p>

          <div className="flex items-center gap-2 pt-1">
            {!isNapping ? (
              <button
                onClick={startNap}
                className="w-full pixel-wood-button py-2.5 px-4 rounded-xl font-pixel text-xs font-bold tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Moon className="w-3.5 h-3.5 text-yellow-300" />
                Take a 20-Second Cozy Nap 💤
              </button>
            ) : (
              <button
                onClick={cancelNap}
                className="w-full py-2 px-4 rounded-xl font-pixel text-xs bg-white text-[#7e22ce] border border-[#c084fc] hover:bg-[#f3e8ff] cursor-pointer"
              >
                Wake Up Early & Stretch! ☀️
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
