import React, { useState } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { POPMART_COLLECTION, POPMART_SHELF_IMAGE } from '../../data/portfolioData';
import { PopMartFigurine } from '../../types/game';
import { Sparkles, Package, Gift, RotateCcw, Heart, Star } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface BookshelfModalProps {
  onClose: () => void;
}

export const BookshelfModal: React.FC<BookshelfModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'unboxing'>('favorites');
  const [collection, setCollection] = useState<PopMartFigurine[]>(POPMART_COLLECTION);
  
  // Unboxing game state
  const [boxState, setBoxState] = useState<'sealed' | 'shaking' | 'ripping' | 'opened'>('sealed');
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [unboxedFigurine, setUnboxedFigurine] = useState<PopMartFigurine | null>(null);

  const handleShake = () => {
    soundEngine.playShake();
    setBoxState('shaking');
    setShakeCount(prev => prev + 1);
    setTimeout(() => {
      setBoxState('sealed');
    }, 400);
  };

  const handleUnbox = () => {
    soundEngine.playInspect();
    setBoxState('ripping');

    setTimeout(() => {
      soundEngine.playFanfare();
      const candidates = collection;
      const picked = candidates[Math.floor(Math.random() * candidates.length)] || collection[0];
      setUnboxedFigurine(picked);
      setBoxState('opened');

      setCollection(prev =>
        prev.map(item => (item.id === picked.id ? { ...item, acquired: true } : item))
      );
    }, 800);
  };

  const handleResetBox = () => {
    soundEngine.playFootstep();
    setBoxState('sealed');
    setShakeCount(0);
    setUnboxedFigurine(null);
  };

  return (
    <ModalWrapper
      title="POPMART Bookshelf & Figurines"
      subtitle="Rachel's Favorite Creative Hobby · Vinyl Art Toys & Blind Boxes"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-3.5 text-[#4a3b32]">
        {/* Core Hobby Headline */}
        <div className="p-3.5 bg-gradient-to-r from-[#fef3c7] via-[#fce7f3] to-[#ede9fe] rounded-xl border-2 border-[#d59f63] flex items-center gap-3 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-[#5a3014] text-[#fde047] flex items-center justify-center shrink-0 shadow-sm border border-[#d59f63]">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#451a03]">
              Rachel's Favorite Hobby: Figurine & POP MART Collecting! ✨
            </h3>
            <p className="text-xs text-[#78350f] mt-0.5 leading-snug">
              Every figurine carries a story, a tactile design memory, and keeps her company at her desk while building software.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-[#d59f63] gap-2 pt-0.5">
          <button
            onClick={() => {
              soundEngine.playFootstep();
              setActiveTab('favorites');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 font-pixel text-xs rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-[#d59f63] text-[#381a07] font-bold border-t-2 border-x-2 border-[#783e1c]'
                : 'text-[#78350f] hover:bg-[#ebd8bd]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
            Top 2 Favorites & Shelf
          </button>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              setActiveTab('unboxing');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 font-pixel text-xs rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'unboxing'
                ? 'bg-[#d59f63] text-[#381a07] font-bold border-t-2 border-x-2 border-[#783e1c]'
                : 'text-[#78350f] hover:bg-[#ebd8bd]'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-pink-600" />
            Open a Mystery Blind Box!
          </button>
        </div>

        {/* TAB 1: TOP 2 FAVORITES & FIGURINES */}
        {activeTab === 'favorites' && (
          <div className="space-y-3">
            {/* The Top 2 Favorites Spotlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Top Favorite #1: Disney x Dimoo Goofy */}
              <div className="p-3.5 bg-[#f0fdf4] rounded-xl border-2 border-[#4ade80] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[10px] bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full border border-[#86efac] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    Top Favorite #1
                  </span>
                  <span className="text-lg">🏰💚</span>
                </div>
                <h4 className="font-pixel text-xs font-bold text-[#14532d]">
                  Disney x Dimoo: Goofy
                </h4>
                <p className="text-xs text-[#166534] leading-relaxed">
                  Her absolute dream pull! Dimoo styled with Goofy's floppy ears, cozy knit sweater, and goofy cheerful grin.
                </p>
              </div>

              {/* Top Favorite #2: Secret Brown Labubu */}
              <div className="p-3.5 bg-[#fff7ed] rounded-xl border-2 border-[#f97316] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[10px] bg-[#ffedd5] text-[#c2410c] px-2 py-0.5 rounded-full border border-[#fdba74] font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current text-rose-500" />
                    Best Friend Surprise #2
                  </span>
                  <span className="text-lg">🤎🎁</span>
                </div>
                <h4 className="font-pixel text-xs font-bold text-[#7c2d12]">
                  Secret Brown Labubu
                </h4>
                <p className="text-xs text-[#9a3412] leading-relaxed">
                  Her best friend gifted her this ultra-rare secret edition brown Labubu as a complete surprise! Her most cherished treasure.
                </p>
              </div>
            </div>

            {/* Other beloved figures on the shelf */}
            <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e5d0b5] space-y-2">
              <span className="font-pixel text-[11px] font-bold text-[#78350f]">
                More Shelf Companions (Dimoo, Labubu & Skullpanda):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {collection.slice(2).map(fig => (
                  <div key={fig.id} className="p-2 bg-white rounded-lg border border-[#e5d0b5] flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: fig.color }} />
                    <span className="font-medium text-[#451a03] truncate">{fig.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UNBOXING SIMULATOR */}
        {activeTab === 'unboxing' && (
          <div className="p-5 bg-gradient-to-b from-[#fbf4e8] to-[#f5e6d0] rounded-xl border-2 border-[#d59f63] flex flex-col items-center text-center space-y-3">
            <h4 className="font-pixel text-xs sm:text-sm font-bold text-[#451a03]">
              Shake & Rip a Blind Box! 📦✨
            </h4>
            <p className="text-xs text-[#78350f] max-w-sm">
              Shake to test the weight, then rip open the foil pack to see which art toy you pull!
            </p>

            {boxState === 'opened' && unboxedFigurine ? (
              <div className="animate-in zoom-in-75 duration-200 p-4 bg-white rounded-xl border-3 border-[#eab308] shadow-md max-w-xs space-y-2">
                <span className="font-pixel text-xs text-[#b45309] font-bold">
                  🎉 You Pulled:
                </span>
                <h4 className="font-pixel text-sm font-bold text-[#451a03]">
                  {unboxedFigurine.name}
                </h4>
                <p className="text-xs text-[#78350f] leading-snug">
                  {unboxedFigurine.description}
                </p>
                <button
                  onClick={handleResetBox}
                  className="pixel-wood-button py-1.5 px-3 rounded-lg font-pixel text-xs flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Try Another Box
                </button>
              </div>
            ) : (
              <div
                onClick={handleShake}
                className={`w-32 h-40 bg-gradient-to-br from-[#f472b6] to-[#ec4899] rounded-xl border-4 border-[#831843] shadow-lg flex flex-col items-center justify-between p-3 cursor-pointer transition-transform ${
                  boxState === 'shaking' ? 'animate-bounce rotate-6' : 'hover:scale-105'
                }`}
              >
                <span className="font-pixel text-[9px] text-white tracking-widest bg-white/20 px-2 py-0.5 rounded">
                  POPMART
                </span>
                <Package className="w-10 h-10 text-white drop-shadow" />
                <span className="font-pixel text-[10px] text-pink-100">
                  {shakeCount > 0 ? `Shaken ${shakeCount}x` : 'Click to Shake!'}
                </span>
              </div>
            )}

            {boxState !== 'opened' && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleShake}
                  className="py-2 px-3 rounded-xl font-pixel text-xs bg-[#fef3c7] text-[#92400e] border-2 border-[#d97706] cursor-pointer"
                >
                  📦 Shake ({shakeCount})
                </button>
                <button
                  onClick={handleUnbox}
                  className="pixel-wood-button py-2 px-5 rounded-xl font-pixel text-xs font-bold cursor-pointer"
                >
                  Rip Foil & Unbox! ✨
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
