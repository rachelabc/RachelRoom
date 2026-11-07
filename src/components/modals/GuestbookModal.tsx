import React, { useState, useEffect } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { INITIAL_GUESTBOOK_NOTES, ABOUT_ME } from '../../data/portfolioData';
import { GuestbookEntry } from '../../types/game';
import { Mail, Send, Heart, Star, Sparkles, Coffee, Cat, Linkedin, Github } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface GuestbookModalProps {
  onClose: () => void;
}

export const GuestbookModal: React.FC<GuestbookModalProps> = ({ onClose }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('cozy_guestbook_notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_GUESTBOOK_NOTES;
  });

  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [sticker, setSticker] = useState<'star' | 'heart' | 'cat' | 'matcha' | 'sparkle'>('heart');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('cozy_guestbook_notes', JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    soundEngine.playFanfare();
    const newEntry: GuestbookEntry = {
      id: `note-${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      timestamp: 'Just now',
      sticker
    };

    setEntries(prev => [newEntry, ...prev]);
    setAuthor('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const getStickerIcon = (stk: string) => {
    switch (stk) {
      case 'heart': return '💖';
      case 'star': return '⭐';
      case 'cat': return '🐾';
      case 'matcha': return '🍵';
      case 'sparkle': return '✨';
      default: return '💌';
    }
  };

  return (
    <ModalWrapper
      title="Cozy Mailbox & Guestbook"
      subtitle="Leave a Note · Sign the Ledger · Say Hello"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Contact Links Bar */}
        <div className="p-3.5 bg-[#fef3c7] rounded-xl border-2 border-[#f59e0b] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-pixel text-[11px] font-bold text-[#92400e]">
              Let's Connect & Build Together!
            </div>
            <div className="text-[#a16207]">
              Open to creative engineering roles & design collaborations.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="mailto:15.rachelli11@gmail.com"
              className="py-1.5 px-3 rounded-lg font-pixel text-[10px] bg-[#92400e] text-white hover:bg-[#78350f] flex items-center gap-1.5 shadow-xs"
            >
              <Mail className="w-3 h-3" />
              Email Maya
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-lg font-pixel text-[10px] bg-[#334155] text-white hover:bg-[#1e293b] flex items-center gap-1.5 shadow-xs"
            >
              <Github className="w-3 h-3" />
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-lg font-pixel text-[10px] bg-[#0284c7] text-white hover:bg-[#0369a1] flex items-center gap-1.5 shadow-xs"
            >
              <Linkedin className="w-3 h-3" />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Leave a Note Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-[#fbf5e8] rounded-xl border-2 border-[#d59f63] space-y-3">
          <div className="font-pixel text-xs font-bold text-[#451a03] flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-[#d97706]" />
            Leave a Note for Maya & Mochi
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#78350f] mb-1">
                Your Name / Handle:
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Fellow Cal Bear, Traveler, Friend"
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#d59f63] text-xs outline-none focus:ring-2 focus:ring-[#b45309]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#78350f] mb-1">
                Pick a Pixel Sticker:
              </label>
              <div className="flex gap-2">
                {(['heart', 'star', 'cat', 'matcha', 'sparkle'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSticker(s)}
                    className={`flex-1 py-1 text-sm rounded-lg border text-center transition-transform cursor-pointer ${
                      sticker === s
                        ? 'bg-[#fef3c7] border-[#d97706] scale-105'
                        : 'bg-white border-[#ecdcc9] hover:bg-[#fbf5e8]'
                    }`}
                  >
                    {getStickerIcon(s)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#78350f] mb-1">
              Your Message:
            </label>
            <textarea
              required
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Leave some encouragement, a favorite book recommendation, or say hi to Mochi!"
              className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#d59f63] text-xs outline-none focus:ring-2 focus:ring-[#b45309]"
            />
          </div>

          <div className="flex items-center justify-between">
            {submitted ? (
              <span className="text-xs text-emerald-700 font-pixel font-bold animate-pulse">
                ✨ Note pinned to the guestbook!
              </span>
            ) : (
              <span className="text-[11px] text-[#78350f]">
                Stored locally in your browser ledger.
              </span>
            )}

            <button
              type="submit"
              className="pixel-wood-button py-2 px-5 rounded-xl font-pixel text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              Pin Note
            </button>
          </div>
        </form>

        {/* Existing Guestbook Notes */}
        <div className="space-y-2">
          <div className="font-pixel text-xs font-bold text-[#783e1c]">
            Recent Visitors ({entries.length})
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {entries.map(note => (
              <div
                key={note.id}
                className="p-3 bg-white rounded-xl border border-[#ecdcc9] shadow-2xs flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getStickerIcon(note.sticker)}</span>
                    <span className="font-pixel text-[11px] font-bold text-[#451a03]">
                      {note.author}
                    </span>
                    <span className="text-[10px] text-[#a88265]">
                      · {note.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#57361e] pl-6 leading-relaxed">
                    "{note.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
