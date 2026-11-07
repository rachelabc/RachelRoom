import React from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { ABOUT_ME, PORTRAIT_IMAGE } from '../../data/portfolioData';
import { ExternalLink, BookOpen, Cpu, Palette, Sparkles, Laptop } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface DeskModalProps {
  onClose: () => void;
}

export const DeskModal: React.FC<DeskModalProps> = ({ onClose }) => {
  return (
    <ModalWrapper
      title="Rachel's Desk & Workstation"
      subtitle="Dual Monitors · Mechanical Keyboard · Blue Berkeley Backpack"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-[#4a3b32]">
        {/* 1. Character Intro Card (Who I Am) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-[#f8f1e5] rounded-xl border-2 border-[#d59f63] shadow-xs">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-[#003262] text-[#fdb515] border-2 border-[#783e1c] shadow-md flex flex-col items-center justify-center shrink-0 font-pixel font-bold">
            <span className="text-[10px]">CAL</span>
            <span className="text-xl">🐻</span>
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-pixel text-xs text-[#783e1c] bg-[#e9d5ff] px-2 py-0.5 rounded-full border border-[#c084fc] font-bold">
                ABOUT RACHEL LI
              </span>
              <span className="text-xs text-[#78350f] font-semibold">
                UC Berkeley '26 🐻
              </span>
            </div>
            <h3 className="font-pixel text-sm sm:text-base font-bold text-[#451a03]">
              {ABOUT_ME.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#57361e] leading-relaxed">
              Hi! I'm Rachel, a Computer Science & Design student at UC Berkeley. I build digital sanctuaries where playful aesthetics, tactile indie game nostalgia, and crisp engineering meet.
            </p>
          </div>
        </div>

        {/* 2. Direct Portfolio Link Button */}
        <div className="p-4 bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fed7aa] rounded-xl border-2 border-[#d97706] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-pixel font-bold text-[#78350f]">
              <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
              Explore More of Rachel's Work
            </div>
            <p className="text-xs text-[#92400e]">
              View design case studies, interactive apps, and creative projects.
            </p>
          </div>

          <a
            href="https://rachelliportfolio.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playInspect()}
            className="pixel-wood-button py-2.5 px-5 rounded-xl font-pixel text-xs font-bold text-[#451a03] flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            <span>Visit Full Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3. Current Classes at UC Berkeley */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-pixel text-xs font-bold text-[#783e1c]">
            <BookOpen className="w-4 h-4 text-[#ea580c]" />
            Current Classes at Cal
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Class 1: Design Frameworks */}
            <div className="p-3.5 bg-[#fcf9f2] rounded-xl border-2 border-[#d59f63] space-y-1.5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#b45309] mb-1">
                  <BookOpen className="w-4 h-4 text-[#d97706]" />
                  <span className="text-[10px] font-pixel font-bold">THEORY</span>
                </div>
                <h4 className="font-pixel text-xs font-bold text-[#451a03]">
                  Design Frameworks
                </h4>
                <p className="text-xs text-[#57361e] mt-1 leading-snug">
                  Reading scholarly articles and engaging in critical design discussions.
                </p>
              </div>
            </div>

            {/* Class 2: Technology Design Foundations */}
            <div className="p-3.5 bg-[#f0fdf4] rounded-xl border-2 border-[#86efac] space-y-1.5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#15803d] mb-1">
                  <Cpu className="w-4 h-4 text-[#16a34a]" />
                  <span className="text-[10px] font-pixel font-bold">TECH</span>
                </div>
                <h4 className="font-pixel text-xs font-bold text-[#14532d]">
                  Technology Design Foundations
                </h4>
                <p className="text-xs text-[#166534] mt-1 leading-snug">
                  Exploring physical fabrications and emerging creative technology.
                </p>
              </div>
            </div>

            {/* Class 3: Studio Foundations */}
            <div className="p-3.5 bg-[#fdf2f8] rounded-xl border-2 border-[#fbcfe8] space-y-1.5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#9d174d] mb-1">
                  <Palette className="w-4 h-4 text-[#db2777]" />
                  <span className="text-[10px] font-pixel font-bold">STUDIO</span>
                </div>
                <h4 className="font-pixel text-xs font-bold text-[#831843]">
                  Studio Foundations
                </h4>
                <p className="text-xs text-[#9f1239] mt-1 leading-snug">
                  Learning the tangible social and visual impact of design creations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Blue Backpack Detail */}
        <div className="p-3 bg-[#e0f2fe] rounded-xl border border-[#7dd3fc] text-xs text-[#0369a1] flex items-center gap-2.5 shadow-xs">
          <span className="text-xl">🎒</span>
          <span>
            <strong>Blue Berkeley Backpack:</strong> Leaning next to the desk, loaded with her MacBook, sketchbook, USB-C adapters, and an iced tea for campus treks!
          </span>
        </div>
      </div>
    </ModalWrapper>
  );
};
