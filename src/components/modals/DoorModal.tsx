import React from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { DoorClosed, Sparkles, Coffee, Compass } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface DoorModalProps {
  onClose: () => void;
  onBobaRun?: () => void;
  hasBoba?: boolean;
}

export const DoorModal: React.FC<DoorModalProps> = ({ onClose, onBobaRun, hasBoba = false }) => {
  const handleStartBobaRun = () => {
    soundEngine.playFanfare();
    if (onBobaRun) {
      onBobaRun();
    }
    onClose();
  };

  return (
    <ModalWrapper
      title="The Bedroom Door"
      subtitle="Oak Paneled Door · Welcome Mat · Gateway to Berkeley"
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <div className="space-y-3.5 text-[#4a3b32]">
        {/* Campus & Beyond Card */}
        <div className="p-3.5 bg-[#f8f1e5] rounded-xl border-2 border-[#d59f63] flex items-center gap-3.5 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#5a3014] text-[#fef08a] flex items-center justify-center shrink-0 shadow-md border-2 border-[#d59f63]">
            <DoorClosed className="w-6 h-6 text-[#fde047]" />
          </div>
          <div>
            <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#451a03]">
              Campus and Beyond
            </h3>
            <p className="text-xs text-[#57361e] leading-relaxed mt-0.5">
              Right outside lies bustling Telegraph Avenue, the eucalyptus trails of UC Berkeley, and the scent of freshly brewed milk tea.
            </p>
          </div>
        </div>

        {/* The Boba Run Feature */}
        <div className="p-4 bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-xl border-2 border-[#d97706] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs font-bold text-[#78350f] flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#b45309]" />
              Want to step outside for a boba run? 🧋
            </span>
            {hasBoba && (
              <span className="text-[10px] font-pixel bg-[#78350f] text-[#fef08a] px-2 py-0.5 rounded-full">
                Holding Boba! ✨
              </span>
            )}
          </div>
          <p className="text-xs text-[#92400e] leading-relaxed">
            Take a quick 1-second stroll down to Telegraph Ave for an iced Roasted Oolong Milk Tea (30% sweet, oat milk, boba)! Rachel will return holding the drink in hand!
          </p>

          <button
            onClick={handleStartBobaRun}
            className="w-full pixel-wood-button py-2.5 px-4 rounded-xl font-pixel text-xs font-bold tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            {hasBoba ? 'Grab Another Fresh Boba! 🧋' : 'Step Outside for a Boba Run! 🧋'}
          </button>
        </div>

        {/* Telegraph Spots */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#78350f]">
          <div className="p-2.5 bg-[#fefaf4] rounded-lg border border-[#e5d0b5]">
            <span className="font-bold text-[#451a03]">📍 Telegraph Ave:</span> 2 mins to boba cafes & indie bookstores.
          </div>
          <div className="p-2.5 bg-[#fefaf4] rounded-lg border border-[#e5d0b5]">
            <span className="font-bold text-[#451a03]">🐻 Memorial Glade:</span> 5 mins to afternoon sunshine & carillon bells.
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
