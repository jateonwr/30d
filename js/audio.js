/**
 * Web Audio API Sound Synthesizer & Chinese Instrumental Ensemble for Mahjong Solitaire
 * Features Volume Controls for Music (BGM) & Sound Effects (SFX).
 */

// Chinese Pentatonic Scale Frequencies (D-Major Pentatonic)
const GUZHENG_MELODY = [
  { note: 587.33, dur: 0.9 }, // D5
  { note: 493.88, dur: 0.5 }, // B4
  { note: 440.00, dur: 0.9 }, // A4
  { note: 369.99, dur: 0.9 }, // F#4
  { note: 329.63, dur: 0.5 }, // E4
  { note: 293.66, dur: 1.4 }, // D4
  { note: 0,      dur: 0.5 }, // Rest
  { note: 440.00, dur: 0.7 }, // A4
  { note: 493.88, dur: 0.7 }, // B4
  { note: 587.33, dur: 0.9 }, // D5
  { note: 659.25, dur: 0.9 }, // E5
  { note: 739.99, dur: 1.5 }, // F#5
  { note: 587.33, dur: 0.7 }, // D5
  { note: 493.88, dur: 0.9 }, // B4
  { note: 440.00, dur: 1.4 }, // A4
  { note: 0,      dur: 0.6 }, // Rest
  { note: 739.99, dur: 0.7 }, // F#5
  { note: 880.00, dur: 0.9 }, // A5
  { note: 739.99, dur: 0.7 }, // F#5
  { note: 659.25, dur: 0.7 }, // E5
  { note: 587.33, dur: 0.9 }, // D5
  { note: 493.88, dur: 0.9 }, // B4
  { note: 440.00, dur: 0.7 }, // A4
  { note: 369.99, dur: 1.5 }, // F#4
  { note: 440.00, dur: 0.9 }, // A4
  { note: 493.88, dur: 0.9 }, // B4
  { note: 587.33, dur: 2.0 }, // D5
  { note: 0,      dur: 0.8 }  // Rest
];

const DIZI_HARMONY = [
  { note: 739.99, dur: 1.6 }, // F#5
  { note: 587.33, dur: 1.6 }, // D5
  { note: 440.00, dur: 2.0 }, // A4
  { note: 0,      dur: 0.6 },
  { note: 880.00, dur: 1.6 }, // A5
  { note: 739.99, dur: 1.6 }, // F#5
  { note: 659.25, dur: 2.2 }, // E5
  { note: 0,      dur: 0.6 },
  { note: 1174.66, dur: 1.8 },// D6
  { note: 880.00, dur: 1.8 }, // A5
  { note: 739.99, dur: 2.4 }, // F#5
  { note: 0,      dur: 0.8 }
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.sfxVolume = 0.6; // 0.0 to 1.0 (default 60%)
    this.bgmVolume = 0.15; // 0.0 to 1.0 (default 15%)

    // Load saved volume preferences
    try {
      const savedSfx = localStorage.getItem('mahjong_sfx_vol');
      const savedBgm = localStorage.getItem('mahjong_bgm_vol');
      const savedMute = localStorage.getItem('mahjong_muted');

      if (savedSfx !== null) this.sfxVolume = Math.max(0, Math.min(1, parseFloat(savedSfx)));
      if (savedBgm !== null) this.bgmVolume = Math.max(0, Math.min(1, parseFloat(savedBgm)));
      if (savedMute !== null) this.muted = (savedMute === 'true');
    } catch (e) {}

    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.diziTimer = null;
    this.bgmIndex = 0;
    this.diziIndex = 0;
    
    // MP3 Audio Background Stream Fallback
    this.audioElement = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
    this.audioElement.loop = true;
    this.audioElement.volume = this.muted ? 0 : this.bgmVolume * 0.4;
    this.isMp3Loaded = false;

    this.audioElement.addEventListener('canplaythrough', () => {
      this.isMp3Loaded = true;
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('mahjong_sfx_vol', this.sfxVolume);
    } catch (e) {}
  }

  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.muted ? 0 : this.bgmVolume * 0.4;
    }
    try {
      localStorage.setItem('mahjong_bgm_vol', this.bgmVolume);
    } catch (e) {}
  }

  // --- TRADITIONAL CHINESE INSTRUMENTAL BGM ENGINE ---
  startBGM() {
    if (this.bgmPlaying || this.muted) return;
    this.init();
    this.bgmPlaying = true;

    if (this.audioElement) {
      this.audioElement.volume = this.muted ? 0 : this.bgmVolume * 0.4;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // MP3 playing successfully
        }).catch(() => {
          this.startSynthEnsemble();
        });
      } else {
        this.startSynthEnsemble();
      }
    } else {
      this.startSynthEnsemble();
    }
  }

  startSynthEnsemble() {
    if (!this.ctx || !this.bgmPlaying || this.muted) return;
    this.bgmIndex = 0;
    this.diziIndex = 0;
    this.scheduleNextGuzhengNote();
    this.scheduleNextDiziNote();
  }

  scheduleNextGuzhengNote() {
    if (!this.bgmPlaying || this.muted) return;

    const item = GUZHENG_MELODY[this.bgmIndex];
    if (item && item.note > 0) {
      this.playGuzhengNote(item.note);
    }

    const durationMs = (item ? item.dur : 0.8) * 1000;
    this.bgmIndex = (this.bgmIndex + 1) % GUZHENG_MELODY.length;

    this.bgmTimer = setTimeout(() => {
      this.scheduleNextGuzhengNote();
    }, durationMs);
  }

  scheduleNextDiziNote() {
    if (!this.bgmPlaying || this.muted) return;

    const item = DIZI_HARMONY[this.diziIndex];
    if (item && item.note > 0) {
      this.playDiziFluteNote(item.note, item.dur);
    }

    const durationMs = (item ? item.dur : 1.5) * 1000;
    this.diziIndex = (this.diziIndex + 1) % DIZI_HARMONY.length;

    this.diziTimer = setTimeout(() => {
      this.scheduleNextDiziNote();
    }, durationMs);
  }

  // Guzheng (กู่เจิ้ง - Plucked String Synth)
  playGuzhengNote(freq) {
    if (!freq || this.muted || !this.ctx || this.bgmVolume <= 0) return;

    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const peakVol = 0.045 * this.bgmVolume;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakVol, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
  }

  // Dizi (ขลุ่ยจีน - Bamboo Flute Synth with Vibrato)
  playDiziFluteNote(freq, duration) {
    if (!freq || this.muted || !this.ctx || this.bgmVolume <= 0) return;

    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 5Hz Vibrato LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    lfo.frequency.setValueAtTime(5, now);
    lfoGain.gain.setValueAtTime(3.5, now);

    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration + 0.3);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const sustainVol = 0.02 * this.bgmVolume;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(sustainVol, now + 0.15);
    gain.gain.setValueAtTime(sustainVol, now + duration - 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + duration + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.3);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.diziTimer) {
      clearTimeout(this.diziTimer);
      this.diziTimer = null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('mahjong_muted', this.muted);
    } catch (e) {}

    if (this.muted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.muted;
  }

  // Soft Wooden Tap (Tile Click)
  playClick() {
    if (this.muted || this.sfxVolume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Low Thud (Blocked Tile Click)
  playBlocked() {
    if (this.muted || this.sfxVolume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Sparkling Jade Chime (Tile Match)
  playMatch() {
    if (this.muted || this.sfxVolume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.25);
    });
  }

  // Hint Twinkle
  playHint() {
    if (this.muted || this.sfxVolume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [880, 1174.66];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  }

  // Fast Shuffle Sound
  playShuffle() {
    if (this.muted || this.sfxVolume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250 + Math.random() * 300, now + i * 0.04);
      osc.frequency.exponentialRampToValueAtTime(100, now + i * 0.04 + 0.03);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.03);
    }
  }

  // Victory Fanfare & Gong
  playVictory() {
    if (this.muted || this.sfxVolume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low Gong Synth
    const gongOsc = this.ctx.createOscillator();
    const gongGain = this.ctx.createGain();
    gongOsc.type = 'sine';
    gongOsc.frequency.setValueAtTime(130.81, now);
    gongOsc.frequency.exponentialRampToValueAtTime(65, now + 1.5);

    gongGain.gain.setValueAtTime(0.5 * this.sfxVolume, now);
    gongGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    gongOsc.connect(gongGain);
    gongGain.connect(this.ctx.destination);
    gongOsc.start(now);
    gongOsc.stop(now + 1.5);

    // Arpeggio Fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.1 + idx * 0.08);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now + 0.1 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + 0.1 + idx * 0.08);
      osc.stop(now + 0.1 + idx * 0.08 + 0.4);
    });
  }
}

// Export global sound instance
window.soundEngine = new SoundEngine();

// Start BGM automatically on first user interaction (Browser Audio Policy requirement)
const startAudioOnInteraction = () => {
  if (window.soundEngine && !window.soundEngine.muted && !window.soundEngine.bgmPlaying) {
    window.soundEngine.startBGM();
  }
};
window.addEventListener('click', startAudioOnInteraction, { once: true });
window.addEventListener('touchstart', startAudioOnInteraction, { once: true });
