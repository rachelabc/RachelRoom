import React, { useState } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { Sprout, Droplets, Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface PlantsModalProps {
  onClose: () => void;
}

export const PlantsModal: React.FC<PlantsModalProps> = ({ onClose }) => {
  const [waterCount, setWaterCount] = useState<number>(0);
  const [isWatering, setIsWatering] = useState<boolean>(false);

  const handleWater = () => {
    soundEngine.playWater();
    setIsWatering(true);
    setWaterCount(prev => prev + 1);
    setTimeout(() => {
      setIsWatering(false);
    }, 600);
  };

  return (
    <ModalWrapper
      title="Plant Sanctuary & Creative Hobbies"
      subtitle="Monty the Monstera · Trailing Pothos · Ceramics & Baking"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      {/* Interactive Plant Watering Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#ecfdf5] to-[#f0fdf4] rounded-xl border-2 border-[#86efac] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-pixel text-xs text-[#065f46] bg-white px-2 py-0.5 rounded border border-[#86efac]">
              PLANT CARE
            </span>
            <span className="text-xs text-[#047857] font-bold">
              Times Watered: {waterCount}
            </span>
          </div>
          <h3 className="font-pixel text-sm font-bold text-[#064e3b]">
            {isWatering ? 'Sprinkling fresh water... 💦' : 'Monty and the Pothos look thirsty!'}
          </h3>
          <p className="text-xs text-[#047857]">
            Click the watering can to nourish the greenery and watch tiny flower blossoms appear.
          </p>
        </div>

        <button
          onClick={handleWater}
          disabled={isWatering}
          className={`pixel-wood-button py-2.5 px-5 rounded-xl font-pixel text-xs flex items-center gap-2 cursor-pointer shrink-0 ${
            isWatering ? 'scale-95' : ''
          }`}
        >
          <Droplets className="w-4 h-4 text-cyan-200" />
          {isWatering ? 'Watering...' : 'Water Plants!'}
        </button>
      </div>

      {/* Plant Collection */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-pixel text-xs text-[#783e1c] font-bold">
          <Sprout className="w-4 h-4 text-[#16a34a]" />
          My Green Roommates
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              name: "Monty the Monstera",
              species: "Monstera Deliciosa",
              status: waterCount > 0 ? "Blooming with joy! 🌸" : "Needs sunlight & love",
              notes: "Propagated from a single cutting in my freshman dorm. Now has 8 huge fenestrated leaves."
            },
            {
              name: "Penny the Pothos",
              species: "Silver Satin Pothos",
              status: waterCount > 0 ? "Vines trailing happily ✨" : "Thriving on ambient light",
              notes: "Trails down from the wooden plant stand. The most resilient plant I own!"
            },
            {
              name: "Pebble the Succulent",
              species: "Haworthia Cooperi",
              status: "Translucent & plump",
              notes: "Looks like tiny glass green bubbles. Sits on the POPMART bookshelf."
            }
          ].map(p => (
            <div
              key={p.name}
              className="p-3 bg-[#fdfdfc] rounded-xl border-2 border-[#d59f63] flex flex-col justify-between"
            >
              <div>
                <h4 className="font-pixel text-xs font-bold text-[#451a03]">
                  {p.name}
                </h4>
                <div className="text-[10px] text-[#16a34a] font-semibold mb-1">
                  {p.species}
                </div>
                <p className="text-xs text-[#57361e] leading-relaxed mb-2">
                  {p.notes}
                </p>
              </div>
              <div className="text-[10px] font-pixel text-[#065f46] bg-[#f0fdf4] p-1.5 rounded border border-[#bbf7d0] text-center">
                {p.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creative Hobbies Outside of Tech */}
      <div className="p-4 bg-[#fbf5e8] rounded-xl border-2 border-[#d59f63] space-y-2">
        <div className="flex items-center gap-1.5 font-pixel text-xs text-[#783e1c] font-bold">
          <Sparkles className="w-4 h-4 text-[#d97706]" />
          Analog Hobbies (Offline Mindful Moments)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#57361e]">
          <div className="p-2.5 bg-white rounded-lg border border-[#e5d0b5]">
            <span className="font-bold text-[#78350f]">🏺 Wheel-Thrown Ceramics:</span> Throwing stoneware mugs and matcha bowls on the potter's wheel at the Berkeley Student Union Studio.
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-[#e5d0b5]">
            <span className="font-bold text-[#78350f]">🍵 Matcha Baking:</span> Perfecting chewy matcha white chocolate cookies and iced hojicha lattes on Sunday afternoons.
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-[#e5d0b5]">
            <span className="font-bold text-[#78350f]">🎞️ Film Photography:</span> Shooting street snapshots with 35mm film and developing darkroom prints by hand.
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-[#e5d0b5]">
            <span className="font-bold text-[#78350f]">📖 Bullet Journaling:</span> Weekly spreads with fountain pens, botanical stickers, and mood trackers.
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
