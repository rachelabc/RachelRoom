/**
 * Web Audio API synthesized sound effects and cozy lo-fi background music.
 * Completely self-contained with zero external audio assets required.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private bgmInterval: number | null = null;
  private rainNode: AudioNode | null = null;
  private isRainPlaying: boolean = false;

  public tracks = [
    { title: "Stardew Morning", mood: "Pastoral & Cheerful" },
    { title: "Rainy Berkeley Afternoon", mood: "Melancholic Lo-Fi" },
    { title: "Matcha Dreams", mood: "Music Box Lullaby" },
    { title: "Midnight Moffitt Study", mood: "Chill Chiptune" },
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
      this.stopRain();
    } else {
      this.getContext();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getBgmPlaying(): boolean {
    return this.bgmPlaying;
  }

  public getCurrentTrack(): { title: string; mood: string } {
    return this.tracks[this.currentTrackIndex];
  }

  // --- Sound Effects ---

  public playFootstep() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120 + Math.random() * 40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  public playInspect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback silent
    }
  }

  public playMeow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch bend for a cute kitty meow: starts around 580Hz, slides up to 720Hz, drops to 520Hz
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(560, t);
      osc.frequency.linearRampToValueAtTime(740, t + 0.15);
      osc.frequency.linearRampToValueAtTime(510, t + 0.42);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.46);
    } catch {
      // Audio fallback silent
    }
  }

  public playPurr() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, t);

      // Lowpass filter for muffled cozy rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, t);

      gain.gain.setValueAtTime(0.08, t);
      // create 3 purr pulses
      gain.gain.setValueAtTime(0.08, t + 0.15);
      gain.gain.setValueAtTime(0.02, t + 0.25);
      gain.gain.setValueAtTime(0.08, t + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    } catch {
      // Audio fallback silent
    }
  }

  public playWater() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Water droplet sounds
      const notes = [650, 880, 780, 920];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.06);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.09);
      });
    } catch {
      // Audio fallback silent
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Sparkling victory chime for blind box unboxing
      const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      melody.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch {
      // Audio fallback silent
    }
  }

  public playShake() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Rattle sound of figure inside box
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.06;

        osc.type = 'square';
        osc.frequency.setValueAtTime(200 + Math.random() * 80, t);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.linearRampToValueAtTime(0.001, t + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch {
      // Audio fallback silent
    }
  }

  // --- Rain Ambience Generator ---
  public startRain() {
    if (this.isMuted || this.isRainPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02; // Pink noise
        lastOut = data[i];
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      this.rainNode = noise;
      this.isRainPlaying = true;
    } catch {
      // Audio fallback silent
    }
  }

  public stopRain() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
      } catch {
        // Audio fallback
      }
      this.rainNode = null;
    }
    this.isRainPlaying = false;
  }

  // --- Background Lo-Fi Music Synthesizer ---

  public toggleBGM(): boolean {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public nextTrack(): { title: string; mood: string } {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (this.bgmPlaying) {
      this.stopBGM();
      this.startBGM();
    }
    return this.tracks[this.currentTrackIndex];
  }

  public startBGM() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopBGM();
    this.bgmPlaying = true;

    // Define sequences for each track
    // Track 0: Stardew Morning (Pastoral, gentle)
    const track0Notes = [
      [261.63, 329.63, 392.00], // C
      [329.63, 392.00, 523.25], // C/E
      [220.00, 261.63, 329.63], // Am
      [349.23, 440.00, 523.25], // F
      [392.00, 493.88, 587.33], // G
      [329.63, 392.00, 493.88], // Em
      [349.23, 440.00, 523.25], // F
      [261.63, 329.63, 392.00], // C
    ];

    // Track 1: Rainy Berkeley Afternoon (Mellow lo-fi jazz chords)
    const track1Notes = [
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];

    // Track 2: Matcha Dreams (Lullaby music box)
    const track2Notes = [
      [329.63, 392.00], // E G
      [392.00, 523.25], // G C
      [440.00, 523.25], // A C
      [392.00, 493.88], // G B
      [349.23, 440.00], // F A
      [329.63, 392.00], // E G
      [293.66, 349.23], // D F
      [261.63, 329.63], // C E
    ];

    // Track 3: Midnight Moffitt (Chilled retro vibe)
    const track3Notes = [
      [130.81, 261.63, 311.13], // C minor
      [116.54, 233.08, 293.66], // Bb
      [103.83, 207.65, 261.63], // Ab
      [116.54, 233.08, 293.66], // Bb
    ];

    const trackNoteSets = [track0Notes, track1Notes, track2Notes, track3Notes];
    const currentNotes = trackNoteSets[this.currentTrackIndex] || track0Notes;

    let step = 0;
    const tempo = this.currentTrackIndex === 2 ? 650 : (this.currentTrackIndex === 1 ? 950 : 700);

    const playChordStep = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const nowCtx = this.getContext();
      if (!nowCtx) return;

      const chord = currentNotes[step % currentNotes.length];
      chord.forEach((freq, idx) => {
        try {
          const osc = nowCtx.createOscillator();
          const gain = nowCtx.createGain();

          osc.type = this.currentTrackIndex === 2 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, nowCtx.currentTime + idx * 0.04);

          const vol = this.currentTrackIndex === 2 ? 0.04 : 0.035;
          gain.gain.setValueAtTime(0.001, nowCtx.currentTime + idx * 0.04);
          gain.gain.linearRampToValueAtTime(vol, nowCtx.currentTime + idx * 0.04 + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, nowCtx.currentTime + idx * 0.04 + (tempo / 1000) * 0.95);

          osc.connect(gain);
          gain.connect(nowCtx.destination);

          osc.start(nowCtx.currentTime + idx * 0.04);
          osc.stop(nowCtx.currentTime + idx * 0.04 + (tempo / 1000));
        } catch {
          // Silent fallback
        }
      });

      step++;
    };

    playChordStep();
    this.bgmInterval = window.setInterval(playChordStep, tempo);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
