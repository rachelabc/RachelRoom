import React, { useState, useEffect } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { PaperStar } from '../../types/game';
import { INITIAL_PAPER_STARS } from '../../data/portfolioData';
import { Sparkles, Send, Heart, Star, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface PaperStarModalProps {
  onClose: () => void;
  isCompletionTrigger?: boolean;
}

export const PaperStarModal: React.FC<PaperStarModalProps> = ({
  onClose,
  isCompletionTrigger = false
}) => {
  const [stars, setStars] = useState<PaperStar[]>(() => {
    try {
      const saved = localStorage.getItem('rachel_paper_stars');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PAPER_STARS;
  });

  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [starColor, setStarColor] = useState('#fde047');
  const [isFolding, setIsFolding] = useState(false);
  const [justFolded, setJustFolded] = useState(false);
  const [selectedStar, setSelectedStar] = useState<PaperStar | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('rachel_paper_stars', JSON.stringify(stars));
    } catch {
      // ignore
    }
  }, [stars]);

  const handleFoldStar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    soundEngine.playInspect();
    setIsFolding(true);

    setTimeout(() => {
      soundEngine.playFanfare();
      const newStar: PaperStar = {
        id: `star-${Date.now()}`,
        author: author.trim(),
        message: message.trim(),
        color: starColor,
        timestamp: 'Just now'
      };

      setStars(prev => [newStar, ...prev]);
      setIsFolding(false);
      setJustFolded(true);
      setAuthor('');
      setMessage('');
      setSelectedStar(newStar);
    }, 700);
  };

  const colorOptions = [
    { label: 'Sunbeam Gold', hex: '#fde047' },
    { label: 'Sakura Pink', hex: '#f472b6' },
    { label: 'Lavender Dream', hex: '#c084fc' },
    { label: 'Mint Leaf', hex: '#86efac' },
    { label: 'Sky Blue', hex: '#38bdf8' }
  ];

  return (
    <ModalWrapper
      title={isCompletionTrigger ? "Thanks for Exploring Rachel's Room! ~" : "Bedside Glass Star Jar"}
      subtitle="Lucky Origami Paper Stars · Tied with Wishes & Memories"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Congratulatory & Instruction Banner */}
        <div className="p-4 bg-gradient-to-r from-[#fef3c7] via-[#fce7f3] to-[#f3e8ff] rounded-xl border-2 border-[#f59e0b] shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fbbf24] to-[#f472b6] text-white flex items-center justify-center text-2xl shadow-md shrink-0 animate-bounce">
            ⭐
          </div>
          <div className="space-y-1">
            <h3 className="font-pixel text-sm sm:text-base font-bold text-[#78350f]">
              {isCompletionTrigger ? "You've Explored All 5 Areas! 🎉" : "The Lucky Paper Star Jar"}
            </h3>
            <p className="text-xs text-[#92400e] leading-relaxed">
              Thanks for exploring Rachel's room! Leave a note or a sweet thought: fold your message into a colorful origami paper star that will be tucked into the glowing glass jar on the bedside table!
            </p>
          </div>
        </div>

        {/* Paper Star Folding Form */}
        <form onSubmit={handleFoldStar} className="p-4 bg-[#fbf6ec] rounded-xl border-2 border-[#d59f63] space-y-3">
          <div className="font-pixel text-xs font-bold text-[#451a03] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Fold a Paper Star Wish
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#78350f] mb-1">
                Your Name:
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Fellow Bear, Friend, Traveler"
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#d59f63] text-xs outline-none focus:ring-2 focus:ring-[#b45309]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#78350f] mb-1">
                Origami Paper Color:
              </label>
              <div className="flex gap-2">
                {colorOptions.map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setStarColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer shadow-xs ${
                      starColor === c.hex
                        ? 'border-[#78350f] scale-115 ring-2 ring-[#b45309]'
                        : 'border-white/80 hover:scale-105'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#78350f] mb-1">
              Your Thought / Note / Wish:
            </label>
            <textarea
              required
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write a message, favorite memory, cozy game recommendation, or kind wish for Rachel & Mochi..."
              className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#d59f63] text-xs outline-none focus:ring-2 focus:ring-[#b45309]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {justFolded ? (
              <span className="text-xs text-emerald-700 font-pixel font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Paper star placed in the bedside jar! ✨
              </span>
            ) : (
              <span className="text-[11px] text-[#78350f]">
                Tucked safely into the glowing star jar.
              </span>
            )}

            <button
              type="submit"
              disabled={isFolding}
              className="pixel-wood-button py-2 px-5 rounded-xl font-pixel text-xs cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              {isFolding ? 'Folding Star...' : 'Fold Star into Jar ⭐'}
            </button>
          </div>
        </form>

        {/* Selected Star Reader Modal */}
        {selectedStar && (
          <div className="p-3.5 bg-white rounded-xl border-2 border-[#eab308] shadow-sm space-y-1 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[11px] font-bold text-[#b45309] flex items-center gap-1.5">
                <span className="text-base">⭐</span>
                Unfolded Paper Star from {selectedStar.author}
              </span>
              <button
                onClick={() => setSelectedStar(null)}
                className="text-xs text-[#a16207] hover:text-[#78350f] font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-xs text-[#451a03] leading-relaxed italic pl-5">
              "{selectedStar.message}"
            </p>
            <div className="text-[10px] text-[#a88265] pl-5">
              Folded {selectedStar.timestamp}
            </div>
          </div>
        )}

        {/* Glass Star Jar Contents */}
        <div className="p-4 bg-[#fefaf3] rounded-xl border-2 border-[#d59f63] space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-pixel text-xs font-bold text-[#783e1c] flex items-center gap-1.5">
              <span>🏺 Inside the Bedside Glass Jar ({stars.length} Paper Stars)</span>
            </div>
            <span className="text-[11px] text-[#a16207]">Click a star to unfold & read</span>
          </div>

          <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto p-2 bg-white/70 rounded-lg border border-[#ecdcc9]">
            {stars.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => {
                  soundEngine.playInspect();
                  setSelectedStar(s);
                }}
                style={{ backgroundColor: s.color }}
                className="px-3 py-1.5 rounded-full font-pixel text-[11px] text-[#381a07] font-bold border-2 border-black/15 shadow-xs hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5"
              >
                <span>⭐</span>
                <span>{s.author}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
