import React from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { TRAVEL_JOURNAL } from '../../data/portfolioData';
import { Plane, Compass, Camera, MapPin, Tag } from 'lucide-react';

interface SuitcaseModalProps {
  onClose: () => void;
}

export const SuitcaseModal: React.FC<SuitcaseModalProps> = ({ onClose }) => {
  return (
    <ModalWrapper
      title="Vintage Leather Suitcase"
      subtitle="Travel Logs · Passport Stamps · 35mm Film Camera · Field Notes"
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      {/* Intro Box */}
      <div className="p-4 bg-[#f8f1e5] rounded-xl border-2 border-[#d59f63] flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#92400e] text-white flex items-center justify-center shrink-0 shadow-md">
          <Compass className="w-6 h-6 text-amber-300" />
        </div>
        <div>
          <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#451a03]">
            Curious Traveler & Film Photographer
          </h3>
          <p className="text-xs text-[#57361e] leading-relaxed mt-0.5">
            "Whenever semester ends, this worn suitcase gets packed with my Olympus 35mm film camera, sketchbook, and comfortable walking shoes. Traveling teaches me how different cultures experience time, spaces, and objects."
          </p>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {TRAVEL_JOURNAL.map((dest, i) => (
          <div
            key={i}
            className="p-4 bg-[#fffdfa] rounded-xl border-2 border-[#d59f63] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-pixel text-xs text-[#9a3412] font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                  {dest.city}
                </span>
                <span className="bg-[#fef3c7] text-[#854d0e] font-pixel text-[10px] px-2 py-0.5 rounded border border-[#fde047]">
                  {dest.year}
                </span>
              </div>

              <div className="text-[11px] text-[#78350f] font-semibold mb-1">
                Favorite: {dest.favoriteSpot}
              </div>

              <p className="text-xs text-[#57361e] leading-relaxed mb-3">
                "{dest.notes}"
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#ecdcc9]">
              {dest.tags.map((t: string) => (
                <span
                  key={t}
                  className="text-[10px] bg-[#f5e8d8] text-[#78350f] px-2 py-0.5 rounded"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Packing Essentials */}
      <div className="p-4 bg-[#f3ebd8] rounded-xl border-2 border-[#c79265] space-y-2">
        <div className="flex items-center gap-1.5 font-pixel text-xs text-[#783e1c] font-bold">
          <Camera className="w-4 h-4 text-[#ea580c]" />
          Everyday Carry & Travel Essentials
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#57361e]">
          <div className="p-2 bg-white rounded border border-[#d59f63] text-center">
            📸 Olympus 35mm Camera
          </div>
          <div className="p-2 bg-white rounded border border-[#d59f63] text-center">
            📓 Moleskine Dot Journal
          </div>
          <div className="p-2 bg-white rounded border border-[#d59f63] text-center">
            🎧 Noise-canceling headphones
          </div>
          <div className="p-2 bg-white rounded border border-[#d59f63] text-center">
            👟 Comfy Sambas for 25k steps
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
