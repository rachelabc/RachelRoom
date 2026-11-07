import React, { useState } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { TUXEDO_CAT_IMAGE } from '../../data/portfolioData';
import { Heart, Sparkles, Fish, Crown, Music, MessageCircle } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface CatModalProps {
  onClose: () => void;
  catState: 'sleeping' | 'purring' | 'following' | 'eating';
  onPetCat: () => void;
  onFeedCat: () => void;
  onChat: () => void;
}

export const CatModal: React.FC<CatModalProps> = ({
  onClose,
  catState,
  onPetCat,
  onFeedCat,
  onChat
}) => {
  const [purrCount, setPurrCount] = useState<number>(14);
  const [reaction, setReaction] = useState<string>("Soobin gazes at you like royalty with emerald eyes.");

  const handlePet = () => {
    soundEngine.playMeow();
    soundEngine.playPurr();
    onPetCat();
    setPurrCount(prev => prev + 1);
    setReaction("Hehe! Soobin purrs happily, wiggles with joy, and hearts float up! (=^ ◡ ^=)");
  };

  const handleFeed = () => {
    soundEngine.playMeow();
    onFeedCat();
    setReaction("Soobin munches on her favorite crunchy snack and happily trots behind you! 🐟");
  };

  return (
    <ModalWrapper
      title="Introducing Soobin, Rachel's Cat! 🐱👑"
      subtitle="Tuxedo Cat · 6 Years Old · The Independent Queen"
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <div className="space-y-3.5 text-[#4a3b32]">
        {/* Cat Banner */}
        <div className="relative rounded-xl overflow-hidden border-2 border-[#783e1c] shadow-md bg-gradient-to-r from-[#20152e] via-[#352147] to-[#20152e] p-4 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-xl bg-[#130b1c] border-2 border-[#d59f63] shadow-inner flex flex-col items-center justify-center text-3xl shrink-0">
              🐱
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-pink-300 bg-pink-900/60 px-2 py-0.5 rounded border border-pink-400/40 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-300" />
                  Independent Queen
                </span>
                <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded border border-purple-400/40">
                  Purr Level: {purrCount}
                </span>
              </div>
              <h3 className="font-pixel text-sm sm:text-base font-bold text-[#fef08a] drop-shadow">
                Soobin (6 Years Old)
              </h3>
              <p className="text-xs text-purple-200 font-sans">
                Snacking enthusiast & independent ruler of the bedroom
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#f3e8ff] border-2 border-[#c084fc] space-y-2">
          <p className="text-sm text-[#581c87]">Meow! Want the inside scoop on Rachel? Ask me about her design projects, favorite boba, and our late-night adventures.</p>
          <button onClick={onChat} className="w-full pixel-wood-button rounded-xl px-4 py-3 font-pixel text-xs flex items-center justify-center gap-2">
            <MessageCircle size={18} /> Chat with Soobin
          </button>
        </div>

        {/* Fact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Named after TXT Soobin */}
          <div className="p-3 bg-[#fdf2f8] rounded-xl border-2 border-[#fbcfe8] flex items-start gap-2.5">
            <span className="text-xl p-1 bg-white rounded-lg border border-[#f472b6] shrink-0">
              🎵
            </span>
            <div className="space-y-0.5">
              <h4 className="font-pixel text-xs font-bold text-[#9d174d]">
                K-Pop Namesake
              </h4>
              <p className="text-xs text-[#831843] leading-snug">
                Named after <strong>TXT (Tomorrow X Together)</strong> idol <strong>Soobin</strong>! Charming, tall, and effortlessly photogenic.
              </p>
            </div>
          </div>

          {/* Independent Queen */}
          <div className="p-3 bg-[#f5f3ff] rounded-xl border-2 border-[#ddd6fe] flex items-start gap-2.5">
            <span className="text-xl p-1 bg-white rounded-lg border border-[#a78bfa] shrink-0">
              👑
            </span>
            <div className="space-y-0.5">
              <h4 className="font-pixel text-xs font-bold text-[#5b21b6]">
                Independent Queen
              </h4>
              <p className="text-xs text-[#4c1d95] leading-snug">
                <strong>6 years old</strong> and runs the entire bedroom on her own terms. She decides when affection is granted!
              </p>
            </div>
          </div>

          {/* Loves to Snack */}
          <div className="p-3 bg-[#fffbeb] rounded-xl border-2 border-[#fef08a] flex items-start gap-2.5">
            <span className="text-xl p-1 bg-white rounded-lg border border-[#eab308] shrink-0">
              🐟
            </span>
            <div className="space-y-0.5">
              <h4 className="font-pixel text-xs font-bold text-[#854d0e]">
                Snack Connoisseur
              </h4>
              <p className="text-xs text-[#713f12] leading-snug">
                She <strong>loves to snack</strong> all day long! Crunchy salmon treats are her absolute weakness.
              </p>
            </div>
          </div>

          {/* Favorite Toys */}
          <div className="p-3 bg-[#f0fdf4] rounded-xl border-2 border-[#bbf7d0] flex items-start gap-2.5">
            <span className="text-xl p-1 bg-white rounded-lg border border-[#4ade80] shrink-0">
              🧶
            </span>
            <div className="space-y-0.5">
              <h4 className="font-pixel text-xs font-bold text-[#166534]">
                Favorite Toys
              </h4>
              <p className="text-xs text-[#14532d] leading-snug">
                Ignores expensive cat toys — her true obsessions are <strong>human dental floss</strong> and soft <strong>yarn balls</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Play Bar */}
        <div className="p-3.5 bg-[#faf5ff] rounded-xl border-2 border-[#d8b4fe] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-pixel text-xs text-[#6b21a8] font-bold">
              Interactive Playtime
            </span>
            <span className="text-xs text-[#7e22ce] font-semibold">
              {catState === 'following' ? '🐾 Following Rachel' : (catState === 'purring' ? '💖 Hehe~ Purring' : '👀 Exploring Room')}
            </span>
          </div>

          <p className="text-xs text-[#581c87] bg-white p-2.5 rounded-lg border border-[#e9d5ff] italic">
            {reaction}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={handlePet}
              className="flex-1 pixel-wood-button py-2.5 px-4 rounded-xl font-pixel text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Heart className="w-3.5 h-3.5 text-pink-300" />
              Pet Soobin (Hehe & Hearts!)
            </button>

            <button
              onClick={handleFeed}
              className="flex-1 py-2.5 px-4 rounded-xl font-pixel text-xs bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#9d174d] border-2 border-[#f472b6] shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Fish className="w-3.5 h-3.5 text-[#ec4899]" />
              Give Crunchy Snack 🐟
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
