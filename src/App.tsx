import React, { useState, useEffect } from 'react';
import { ZoneId, TimeOfDay } from './types/game';
import { PixelRoomCanvas } from './components/PixelRoomCanvas';
import { DeskModal } from './components/modals/DeskModal';
import { BookshelfModal } from './components/modals/BookshelfModal';
import { BedModal } from './components/modals/BedModal';
import { CatModal } from './components/modals/CatModal';
import { DoorModal } from './components/modals/DoorModal';
import { PaperStarModal } from './components/modals/PaperStarModal';
import { CelebrationModal } from './components/modals/CelebrationModal';
import { WelcomeModal } from './components/WelcomeModal';
import { soundEngine } from './utils/soundEngine';
import { 
  Laptop, 
  Sparkles, 
  Bed, 
  DoorClosed, 
  Sun, 
  CloudRain, 
  Moon, 
  Volume2, 
  VolumeX, 
  Disc3, 
  Heart,
  Star,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<ZoneId | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('sunny');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [catState, setCatState] = useState<'sleeping' | 'purring' | 'following' | 'eating'>('eating');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [hasBoba, setHasBoba] = useState<boolean>(false);
  const [isBobaRunning, setIsBobaRunning] = useState<boolean>(false);

  // 20-second Nap state
  const [isNapping, setIsNapping] = useState<boolean>(false);
  const [napCountdown, setNapCountdown] = useState<number>(20);

  // THE 5 EXACT EXPLORATION AREAS (Numbered 1 to 5, Paper Star Jar is final reward)
  const CORE_5_ZONES: ZoneId[] = ['bed', 'door', 'cat', 'bookshelf', 'desk'];

  const [exploredZones, setExploredZones] = useState<Set<ZoneId>>(() => {
    try {
      const saved = localStorage.getItem('rachel_explored_zones');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    return new Set<ZoneId>();
  });

  const [hasShownCompletionModal, setHasShownCompletionModal] = useState<boolean>(false);
  const [showInstructionsDrawer, setShowInstructionsDrawer] = useState<boolean>(false);

  // 20-second Nap timer handler
  useEffect(() => {
    if (!isNapping) return;
    if (napCountdown > 0) {
      const timer = setTimeout(() => {
        setNapCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Nap finished!
      soundEngine.playFanfare();
      setIsNapping(false);
      setNapCountdown(20);
    }
  }, [isNapping, napCountdown]);

  const handleStartNap = () => {
    setActiveModal(null);
    setIsNapping(true);
    setNapCountdown(20);
    soundEngine.playPurr();
  };

  const handleWakeEarly = () => {
    setIsNapping(false);
    setNapCountdown(20);
    soundEngine.playInspect();
  };

  const handleResetProgress = () => {
    setExploredZones(new Set());
    setHasShownCompletionModal(false);
    setShowCelebration(false);
    setHasBoba(false);
    setIsNapping(false);
    try {
      localStorage.removeItem('rachel_explored_zones');
    } catch {
      // ignore
    }
    setShowWelcome(true);
    soundEngine.playInspect();
  };

  const handleBobaRun = () => {
    setActiveModal(null);
    setIsBobaRunning(true);
    soundEngine.playFootstep();
    setTimeout(() => {
      soundEngine.playFanfare();
      setIsBobaRunning(false);
      setHasBoba(true);
    }, 1800);
  };

  useEffect(() => {
    try {
      localStorage.setItem('rachel_explored_zones', JSON.stringify(Array.from(exploredZones)));
    } catch {
      // ignore
    }

    // Check if all 5 areas are explored!
    const allExplored = CORE_5_ZONES.every(z => exploredZones.has(z));
    if (allExplored && !hasShownCompletionModal) {
      setHasShownCompletionModal(true);
      const timer = setTimeout(() => {
        soundEngine.playFanfare();
        setShowCelebration(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [exploredZones, hasShownCompletionModal]);

  const handleOpenZone = (zone: ZoneId | null) => {
    setActiveModal(zone);
    if (zone && CORE_5_ZONES.includes(zone)) {
      setExploredZones(prev => new Set(prev).add(zone));
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (next) {
      setIsMusicPlaying(false);
    }
  };

  const handleToggleMusic = () => {
    if (isMuted) {
      setIsMuted(false);
      soundEngine.setMuted(false);
    }
    const playing = soundEngine.toggleBGM();
    setIsMusicPlaying(playing);
  };

  const handlePetCat = () => {
    setCatState('purring');
    setExploredZones(prev => new Set(prev).add('cat'));
    soundEngine.playMeow();
    soundEngine.playPurr();
    setTimeout(() => {
      if (catState !== 'following') {
        setCatState('eating');
      }
    }, 4000);
  };

  const handleFeedCat = () => {
    setCatState('following');
    setExploredZones(prev => new Set(prev).add('cat'));
    soundEngine.playMeow();
  };

  // THE 5 EXACT EXPLORATION DOCK ITEMS
  const quickNavItems: Array<{ id: ZoneId; label: string; num: number; icon: React.ReactNode }> = [
    { id: 'bed', label: '1. The Bed', num: 1, icon: <Bed className="w-3.5 h-3.5 text-purple-300" /> },
    { id: 'door', label: '2. The Door', num: 2, icon: <DoorClosed className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'cat', label: '3. Soobin the Cat', num: 3, icon: <Heart className="w-3.5 h-3.5 text-pink-300" /> },
    { id: 'bookshelf', label: '4. POPMART Shelf', num: 4, icon: <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> },
    { id: 'desk', label: '5. My Desk', num: 5, icon: <Laptop className="w-3.5 h-3.5 text-cyan-300" /> },
  ];

  const exploredCount = CORE_5_ZONES.filter(z => exploredZones.has(z)).length;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#241c30] text-[#fbf7ee]">
      {/* 
        HEADER: Fixed height h-11, shrink-0
      */}
      <header className="h-11 shrink-0 flex items-center justify-between gap-4 px-3 sm:px-6 bg-[#1a1424] border-b border-[#473859] z-40">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-pixel text-xs sm:text-sm font-bold text-[#fef08a] whitespace-nowrap tracking-wider drop-shadow-xs">
            WELCOME TO MY LITTLE WORLD
          </span>
          <span className="hidden sm:inline-block text-[11px] font-pixel text-[#d8b4fe]">
            · Rachel Li · Cal '26 🐻
          </span>
        </div>

        {/* 5 Area Direct Links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-pixel text-[#d8b4fe]">
          <button
            onClick={() => handleOpenZone('bed')}
            className="hover:text-[#fde047] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>1. Bed</span>
            {exploredZones.has('bed') && <span className="text-emerald-400 text-[10px]">✓</span>}
          </button>
          <button
            onClick={() => handleOpenZone('door')}
            className="hover:text-[#fde047] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>2. Door</span>
            {exploredZones.has('door') && <span className="text-emerald-400 text-[10px]">✓</span>}
          </button>
          <button
            onClick={() => handleOpenZone('cat')}
            className="hover:text-[#fde047] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>3. Soobin</span>
            {exploredZones.has('cat') && <span className="text-emerald-400 text-[10px]">✓</span>}
          </button>
          <button
            onClick={() => handleOpenZone('bookshelf')}
            className="hover:text-[#fde047] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>4. Shelf</span>
            {exploredZones.has('bookshelf') && <span className="text-emerald-400 text-[10px]">✓</span>}
          </button>
          <button
            onClick={() => handleOpenZone('desk')}
            className="hover:text-[#fde047] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>5. Desk</span>
            {exploredZones.has('desk') && <span className="text-emerald-400 text-[10px]">✓</span>}
          </button>
        </nav>

        {/* Header Actions: Instructions, Reset, Star Jar, Audio */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => {
              soundEngine.playInspect();
              setShowWelcome(true);
            }}
            className="px-2 py-1 font-pixel text-[11px] rounded bg-[#3b2d4f] hover:bg-[#4d3a67] text-[#fef08a] border border-[#6b538c] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
            title="Open introduction & instructions slide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden md:inline">Instructions</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playInspect();
              handleResetProgress();
            }}
            className="px-2 py-1 font-pixel text-[11px] rounded bg-[#3b2d4f] hover:bg-[#581c87] text-[#fbcfe8] border border-[#6b538c] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
            title="Reset tour and return to intro slide"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playInspect();
              setActiveModal('starjar');
            }}
            className="px-2 py-1 font-pixel text-[11px] rounded bg-[#581c87] hover:bg-[#6b21a8] text-[#fde047] border border-[#a855f7] flex items-center gap-1 cursor-pointer shadow-xs"
            title="Open bedside paper star jar"
          >
            <Star className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span className="hidden sm:inline">Star Jar</span>
          </button>

          <button
            onClick={handleToggleMusic}
            className={`px-2.5 py-1 font-pixel text-[11px] rounded flex items-center gap-1 whitespace-nowrap cursor-pointer shadow-xs transition-all ${
              isMusicPlaying
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-[#451a03] font-bold border border-yellow-200'
                : 'bg-[#2a1e38] text-[#d8b4fe] border border-[#6b538c] hover:bg-[#39284d]'
            }`}
            title="Turn Lo-Fi Music ON or OFF"
          >
            <Disc3 className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-spin text-[#451a03]' : 'text-purple-300'}`} />
            <span className="hidden sm:inline">
              {isMusicPlaying ? 'Lo-Fi: ON 🎵' : 'Lo-Fi: OFF 🔇'}
            </span>
          </button>

          <button
            onClick={handleToggleMute}
            className={`p-1 rounded border cursor-pointer ${
              isMuted
                ? 'bg-red-900/60 border-red-500 text-red-200'
                : 'bg-[#3b2d4f] border-[#6b538c] text-[#fef08a] hover:bg-[#4d3a67]'
            }`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* SUBHEADER / HUD BAR: Fixed height h-8, shrink-0 */}
      <div className="h-8 shrink-0 bg-[#1e172a] border-b border-[#3b2d4f] px-3 sm:px-6 flex items-center justify-between text-xs">
        {/* 5 Areas Progress Counter */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[11px] text-[#fde047]">
            Explored: {exploredCount} / 5
          </span>
          <div className="w-24 sm:w-32 bg-[#3b2d4f] h-2 rounded-full overflow-hidden border border-[#5d477b]">
            <div
              className="bg-gradient-to-r from-[#d8b4fe] to-[#fde047] h-full rounded-full transition-all duration-300"
              style={{ width: `${(exploredCount / 5) * 100}%` }}
            />
          </div>
          {exploredCount === 5 ? (
            <span className="text-[10px] font-pixel text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All 5 Explored! ⭐
            </span>
          ) : (
            <span className="text-[10px] font-pixel text-[#d8b4fe]">
              ({5 - exploredCount} remaining)
            </span>
          )}
        </div>

        {/* Time of Day Toggles */}
        <div className="flex items-center gap-1 bg-[#151020] p-0.5 rounded border border-[#473859]">
          <button
            onClick={() => {
              soundEngine.playInspect();
              setTimeOfDay('sunny');
              soundEngine.stopRain();
            }}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              timeOfDay === 'sunny'
                ? 'bg-[#fde047] text-[#713f12] font-bold'
                : 'text-[#d8b4fe] hover:bg-[#34264a]'
            }`}
            title="Sunny Afternoon"
          >
            <Sun className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              soundEngine.playInspect();
              setTimeOfDay('rainy');
              soundEngine.startRain();
            }}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              timeOfDay === 'rainy'
                ? 'bg-[#38bdf8] text-[#082f49] font-bold'
                : 'text-[#d8b4fe] hover:bg-[#34264a]'
            }`}
            title="Rainy Mode (Soobin Zoomies!)"
          >
            <CloudRain className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              soundEngine.playInspect();
              setTimeOfDay('night');
              soundEngine.stopRain();
            }}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              timeOfDay === 'night'
                ? 'bg-[#c084fc] text-[#3b0764] font-bold'
                : 'text-[#d8b4fe] hover:bg-[#34264a]'
            }`}
            title="Starry Midnight (Sleep mode)"
          >
            <Moon className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* MAIN SCREEN: flex-1, overflow-hidden, fits perfectly without scrolling */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-between p-1 sm:p-2 w-full max-w-5xl mx-auto">
        {/* 2D Pixel Canvas */}
        <PixelRoomCanvas
          onInteract={handleOpenZone}
          activeModal={activeModal}
          timeOfDay={timeOfDay}
          catState={catState}
          onPetCat={handlePetCat}
          exploredZones={exploredZones}
          hasBoba={hasBoba}
          isBobaRunning={isBobaRunning}
          isNapping={isNapping}
          napCountdown={napCountdown}
          onWakeEarly={handleWakeEarly}
        />

        {/* 5-Item Exploration Dock */}
        <div className="w-full max-w-4xl shrink-0 mt-1">
          <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-[#1a1424] rounded-lg border border-[#473859]">
            {quickNavItems.map(item => {
              const isExplored = exploredZones.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playInspect();
                    handleOpenZone(item.id);
                  }}
                  className={`flex items-center justify-between p-1.5 sm:p-2 rounded font-pixel text-[11px] transition-all cursor-pointer border ${
                    isExplored
                      ? 'bg-[#2f2042] text-[#fef08a] border-[#6b538c]'
                      : 'bg-[#221830] text-[#c4b5fd] border-[#3b2d4f] hover:bg-[#312347]'
                  }`}
                >
                  <div className="flex items-center gap-1 truncate">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isExplored ? (
                    <span className="text-emerald-400 text-[10px] font-bold shrink-0">✓</span>
                  ) : (
                    <span className="text-[9px] text-amber-300 shrink-0">New</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER: Fixed height h-6, shrink-0 */}
      <footer className="h-6 shrink-0 flex items-center justify-between px-4 text-[10px] font-pixel text-[#a78bfa]/80 bg-[#161020] border-t border-[#3b2d4f]">
        <span>Designed & coded with warmth by Rachel Li · UC Berkeley '26 🐻</span>
        <button
          onClick={() => setActiveModal('starjar')}
          className="text-[#fde047] hover:underline cursor-pointer flex items-center gap-1"
        >
          ⭐ Bedside Glass Star Jar ({Array.from(exploredZones).filter(z => CORE_5_ZONES.includes(z)).length}/5 Explored)
        </button>
      </footer>

      {/* MODALS */}
      {showWelcome && (
        <WelcomeModal
          onStart={() => setShowWelcome(false)}
          onClose={() => setShowWelcome(false)}
          onResetProgress={handleResetProgress}
          isRevisit={exploredCount > 0}
        />
      )}

      {showCelebration && (
        <CelebrationModal
          onClose={() => setShowCelebration(false)}
          onOpenStarJar={() => {
            setShowCelebration(false);
            setActiveModal('starjar');
          }}
        />
      )}

      {activeModal === 'bed' && (
        <BedModal
          onClose={() => setActiveModal(null)}
          onNapStart={handleStartNap}
        />
      )}
      {activeModal === 'door' && (
        <DoorModal
          onClose={() => setActiveModal(null)}
          onBobaRun={handleBobaRun}
          hasBoba={hasBoba}
        />
      )}
      {activeModal === 'cat' && (
        <CatModal
          onClose={() => setActiveModal(null)}
          catState={catState}
          onPetCat={handlePetCat}
          onFeedCat={handleFeedCat}
        />
      )}
      {activeModal === 'bookshelf' && (
        <BookshelfModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'desk' && (
        <DeskModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'starjar' && (
        <PaperStarModal
          onClose={() => setActiveModal(null)}
          isCompletionTrigger={exploredCount === 5}
        />
      )}
    </div>
  );
}
