import React from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { TimeOfDay } from '../../types/game';
import { Sun, CloudRain, Moon, Sparkles, Volume2 } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface WindowModalProps {
  onClose: () => void;
  timeOfDay: TimeOfDay;
  onSelectTime: (time: TimeOfDay) => void;
}

export const WindowModal: React.FC<WindowModalProps> = ({
  onClose,
  timeOfDay,
  onSelectTime
}) => {
  const handleSelect = (time: TimeOfDay) => {
    soundEngine.playInspect();
    onSelectTime(time);
    if (time === 'rainy') {
      soundEngine.startRain();
    } else {
      soundEngine.stopRain();
    }
  };

  return (
    <ModalWrapper
      title="Bedroom Arched Window"
      subtitle="Sky View · Atmosphere · Day & Night Lighting Controls"
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <p className="text-xs text-[#57361e] leading-relaxed">
          Through the arched bedroom window, you can watch the Berkeley hills and sky shift colors. Change the atmosphere in real time to alter the room's dynamic lighting and ambient audio:
        </p>

        {/* 3 Weather Mode Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSelect('sunny')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
              timeOfDay === 'sunny'
                ? 'bg-[#fef9c3] border-[#ca8a04] shadow-md scale-102 ring-2 ring-[#eab308]'
                : 'bg-[#fffdf7] border-[#e5d0b5] hover:bg-[#fefce8]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#fde047] text-[#854d0e] flex items-center justify-center mb-2 shadow-xs">
              <Sun className="w-5 h-5 text-[#ca8a04]" />
            </div>
            <span className="font-pixel text-xs font-bold text-[#854d0e]">
              Sunny Afternoon
            </span>
            <p className="text-[11px] text-[#a16207] mt-1 leading-tight">
              Golden sunbeams, floating dust motes, bright cheerful vibes.
            </p>
          </button>

          <button
            onClick={() => handleSelect('rainy')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
              timeOfDay === 'rainy'
                ? 'bg-[#e0f2fe] border-[#0284c7] shadow-md scale-102 ring-2 ring-[#38bdf8]'
                : 'bg-[#fffdf7] border-[#e5d0b5] hover:bg-[#f0f9ff]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#7dd3fc] text-[#0369a1] flex items-center justify-center mb-2 shadow-xs">
              <CloudRain className="w-5 h-5 text-[#0284c7]" />
            </div>
            <span className="font-pixel text-xs font-bold text-[#0369a1]">
              Rainy Twilight
            </span>
            <p className="text-[11px] text-[#0284c7] mt-1 leading-tight">
              Gentle raindrops on glass, moody blue hue, ambient rain audio.
            </p>
          </button>

          <button
            onClick={() => handleSelect('night')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
              timeOfDay === 'night'
                ? 'bg-[#ede9fe] border-[#7c3aed] shadow-md scale-102 ring-2 ring-[#a855f7]'
                : 'bg-[#fffdf7] border-[#e5d0b5] hover:bg-[#f5f3ff]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#c4b5fd] text-[#5b21b6] flex items-center justify-center mb-2 shadow-xs">
              <Moon className="w-5 h-5 text-[#6d28d9]" />
            </div>
            <span className="font-pixel text-xs font-bold text-[#5b21b6]">
              Starry Midnight
            </span>
            <p className="text-[11px] text-[#6d28d9] mt-1 leading-tight">
              Crescent moon, twinkling stars, cozy warm desk lamp glow.
            </p>
          </button>
        </div>

        {/* Ambient reflection text */}
        <div className="p-3.5 bg-[#f5ebe0] rounded-lg border border-[#d59f63] text-xs text-[#57361e] italic text-center">
          "The best coding sessions always happen when rain taps on the glass and the room is warmed by a mug of tea."
        </div>
      </div>
    </ModalWrapper>
  );
};
