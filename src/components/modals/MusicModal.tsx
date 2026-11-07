import React, { useState } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import { Play, Pause, SkipForward, Disc3, Volume2, VolumeX, CloudRain } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface MusicModalProps {
  onClose: () => void;
}

export const MusicModal: React.FC<MusicModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(soundEngine.getBgmPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [currentTrack, setCurrentTrack] = useState(soundEngine.getCurrentTrack());
  const [rainActive, setRainActive] = useState<boolean>(false);

  const togglePlay = () => {
    soundEngine.playInspect();
    const playing = soundEngine.toggleBGM();
    setIsPlaying(playing);
  };

  const handleNext = () => {
    soundEngine.playInspect();
    const next = soundEngine.nextTrack();
    setCurrentTrack(next);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    soundEngine.setMuted(nextMute);
    setIsMuted(nextMute);
    if (nextMute) {
      setIsPlaying(false);
      setRainActive(false);
    }
  };

  const toggleRainAudio = () => {
    soundEngine.playInspect();
    if (rainActive) {
      soundEngine.stopRain();
      setRainActive(false);
    } else {
      soundEngine.startRain();
      setRainActive(true);
    }
  };

  return (
    <ModalWrapper
      title="Vintage Record Player"
      subtitle="Synthesized Lo-Fi Tracks · Chiptune Melodies · Cozy Soundscapes"
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Turntable Vinyl Graphic */}
        <div className="p-5 bg-[#2a1a1f] rounded-2xl border-4 border-[#5a3014] shadow-inner flex flex-col items-center justify-center text-center">
          <div className="relative my-2">
            <Disc3
              className={`w-28 h-28 text-[#d8b4fe] transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#f43f5e] border-2 border-white/80" />
            </div>
          </div>

          <div className="mt-2 space-y-0.5">
            <span className="font-pixel text-[11px] text-[#fde047] uppercase tracking-wider">
              NOW PLAYING
            </span>
            <h3 className="font-pixel text-sm md:text-base font-bold text-white">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-purple-200">
              Mood: {currentTrack.mood}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#d59f63] hover:bg-[#b87a3e] text-[#381a07] border-2 border-[#fff9f0] shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-[#5a3014] hover:bg-[#783e1c] text-[#fef08a] border-2 border-[#d59f63] shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className={`w-10 h-10 rounded-full border-2 shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                isMuted
                  ? 'bg-red-900/80 text-red-200 border-red-500'
                  : 'bg-[#5a3014] text-[#fef08a] border-[#d59f63]'
              }`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Rain Sound Ambient Toggle */}
        <div className="p-3 bg-[#e0f2fe] rounded-xl border border-[#7dd3fc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-[#0284c7]" />
            <span className="text-xs font-semibold text-[#0369a1]">
              Rainfall Window Ambience Generator
            </span>
          </div>
          <button
            onClick={toggleRainAudio}
            className={`px-3 py-1 font-pixel text-[11px] rounded-lg border cursor-pointer ${
              rainActive
                ? 'bg-[#0284c7] text-white border-[#0369a1]'
                : 'bg-white text-[#0369a1] border-[#7dd3fc] hover:bg-[#f0f9ff]'
            }`}
          >
            {rainActive ? 'Rain Active' : 'Start Rain'}
          </button>
        </div>

        {/* Track List */}
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-pixel font-bold text-[#783e1c]">
            Track List
          </div>
          {soundEngine.tracks.map((t, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                currentTrack.title === t.title
                  ? 'bg-[#fef3c7] border-[#f59e0b] font-bold text-[#92400e]'
                  : 'bg-[#fdfaf5] border-[#ecdcc9] text-[#57361e]'
              }`}
            >
              <span>{idx + 1}. {t.title}</span>
              <span className="text-[11px] opacity-75">{t.mood}</span>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};
