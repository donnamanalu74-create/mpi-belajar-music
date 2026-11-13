/**
 * Realistic Acoustic Piano Web Audio Synthesizer & Sound FX Engine
 * Optimized for Interactive Flat Panel (IFP) education at SD TERAMIA
 */

// Note frequency map for 2 full octaves (C4 to B5)
export interface PianoNoteData {
  note: string;       // e.g. "C4"
  freq: number;       // Hz
  solfege: string;    // "Do", "Re", etc.
  solfegeNum: string; // "1", "2", etc.
  octave: number;     // 4 or 5
  isBlack: boolean;
  staffPosition: number; // Vertical position offset for treble clef (0 = C4 Middle C)
}

export const PIANO_NOTES: PianoNoteData[] = [
  { note: 'C4', freq: 261.63, solfege: 'Do', solfegeNum: '1', octave: 4, isBlack: false, staffPosition: 0 },
  { note: 'C#4', freq: 277.18, solfege: 'Di', solfegeNum: '1#', octave: 4, isBlack: true, staffPosition: 0.5 },
  { note: 'D4', freq: 293.66, solfege: 'Re', solfegeNum: '2', octave: 4, isBlack: false, staffPosition: 1 },
  { note: 'D#4', freq: 311.13, solfege: 'Ri', solfegeNum: '2#', octave: 4, isBlack: true, staffPosition: 1.5 },
  { note: 'E4', freq: 329.63, solfege: 'Mi', solfegeNum: '3', octave: 4, isBlack: false, staffPosition: 2 },
  { note: 'F4', freq: 349.23, solfege: 'Fa', solfegeNum: '4', octave: 4, isBlack: false, staffPosition: 3 },
  { note: 'F#4', freq: 369.99, solfege: 'Fi', solfegeNum: '4#', octave: 4, isBlack: true, staffPosition: 3.5 },
  { note: 'G4', freq: 392.00, solfege: 'Sol', solfegeNum: '5', octave: 4, isBlack: false, staffPosition: 4 },
  { note: 'G#4', freq: 415.30, solfege: 'Sel', solfegeNum: '5#', octave: 4, isBlack: true, staffPosition: 4.5 },
  { note: 'A4', freq: 440.00, solfege: 'La', solfegeNum: '6', octave: 4, isBlack: false, staffPosition: 5 },
  { note: 'A#4', freq: 466.16, solfege: 'Li', solfegeNum: '6#', octave: 4, isBlack: true, staffPosition: 5.5 },
  { note: 'B4', freq: 493.88, solfege: 'Si', solfegeNum: '7', octave: 4, isBlack: false, staffPosition: 6 },
  
  // Octave 5
  { note: 'C5', freq: 523.25, solfege: "Do'", solfegeNum: "1'", octave: 5, isBlack: false, staffPosition: 7 },
  { note: 'C#5', freq: 554.37, solfege: "Di'", solfegeNum: "1'#", octave: 5, isBlack: true, staffPosition: 7.5 },
  { note: 'D5', freq: 587.33, solfege: "Re'", solfegeNum: "2'", octave: 5, isBlack: false, staffPosition: 8 },
  { note: 'D#5', freq: 622.25, solfege: "Ri'", solfegeNum: "2'#", octave: 5, isBlack: true, staffPosition: 8.5 },
  { note: 'E5', freq: 659.25, solfege: "Mi'", solfegeNum: "3'", octave: 5, isBlack: false, staffPosition: 9 },
  { note: 'F5', freq: 698.46, solfege: "Fa'", solfegeNum: "4'", octave: 5, isBlack: false, staffPosition: 10 },
  { note: 'F#5', freq: 739.99, solfege: "Fi'", solfegeNum: "4'#", octave: 5, isBlack: true, staffPosition: 10.5 },
  { note: 'G5', freq: 783.99, solfege: "Sol'", solfegeNum: "5'", octave: 5, isBlack: false, staffPosition: 11 },
  { note: 'G#5', freq: 830.61, solfege: "Sel'", solfegeNum: "5'#", octave: 5, isBlack: true, staffPosition: 11.5 },
  { note: 'A5', freq: 880.00, solfege: "La'", solfegeNum: "6'", octave: 5, isBlack: false, staffPosition: 12 },
  { note: 'A#5', freq: 932.33, solfege: "Li'", solfegeNum: "6'#", octave: 5, isBlack: true, staffPosition: 12.5 },
  { note: 'B5', freq: 987.77, solfege: "Si'", solfegeNum: "7'", octave: 5, isBlack: false, staffPosition: 13 },
];

export const NOTE_MAP = new Map<string, PianoNoteData>(
  PIANO_NOTES.map(item => [item.note, item])
);

interface ActiveVoice {
  oscillators: OscillatorNode[];
  gainNodes: GainNode[];
  mainGain: GainNode;
  filter: BiquadFilterNode;
  startTime: number;
}

class PianoAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private activeVoices = new Map<string, ActiveVoice>();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.createImpulseReverb();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate lightweight synthetic acoustic room reverb for warm grand piano resonance
  private createImpulseReverb() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const length = this.ctx.sampleRate * 1.5;
      const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);
      const decay = 2.0;
      for (let i = 0; i < length; i++) {
        const factor = Math.exp(-i / (this.ctx.sampleRate * decay));
        left[i] = (Math.random() * 2 - 1) * factor * 0.15;
        right[i] = (Math.random() * 2 - 1) * factor * 0.15;
      }
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = impulse;
      this.reverbNode.connect(this.masterGain);
    } catch {
      // Ignore if reverb buffer creation fails
    }
  }

  /**
   * Start playing a realistic acoustic piano voice
   * @param note Note identifier e.g. "C4"
   * @param velocity Dynamics volume (0.2 for piano p, 0.6 for mezzo mf, 1.0 for forte f)
   */
  public startNote(note: string, velocity = 0.8) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const noteData = NOTE_MAP.get(note);
    if (!noteData) return;

    // Stop previous voice of same note if currently ringing
    this.stopNote(note, 0.05);

    const now = this.ctx.currentTime;
    const freq = noteData.freq;

    // Main gain for note envelope
    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.0001, now);
    // Instant attack (hammer striking strings)
    const targetGain = Math.min(1.0, Math.max(0.1, velocity));
    mainGain.gain.linearRampToValueAtTime(targetGain, now + 0.005);
    // Natural acoustic piano initial decay to sustained level
    mainGain.gain.exponentialRampToValueAtTime(targetGain * 0.45, now + 0.6);
    // Gradual long decay if sustained
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

    // Warm low-pass filter representing piano soundboard & wood body
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    // Higher velocity opens up filter brilliance (dynamics teaching)
    filter.frequency.setValueAtTime(freq * (3.5 + velocity * 2.5), now);
    filter.Q.setValueAtTime(1.2, now);

    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];

    // Realistic acoustic piano harmonic structure:
    // 1. Fundamental tone (sine + slight triangle)
    // 2. 2nd Harmonic (octave above)
    // 3. 3rd Harmonic (fifth above)
    // 4. Subtle Hammer impulse strike click
    const harmonics = [
      { mult: 1, type: 'triangle' as OscillatorType, gain: 0.65 },
      { mult: 1, type: 'sine' as OscillatorType, gain: 0.35 },
      { mult: 2, type: 'sine' as OscillatorType, gain: 0.25 },
      { mult: 3, type: 'sine' as OscillatorType, gain: 0.10 },
      { mult: 4, type: 'sine' as OscillatorType, gain: 0.04 },
    ];

    harmonics.forEach(h => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = h.type;
      // Slight acoustic detuning for lush chorusing piano strings
      const detune = (Math.random() - 0.5) * 4;
      osc.frequency.setValueAtTime(freq * h.mult, now);
      osc.detune.setValueAtTime(detune, now);

      g.gain.setValueAtTime(h.gain, now);

      osc.connect(g);
      g.connect(filter);
      osc.start(now);

      oscillators.push(osc);
      gainNodes.push(g);
    });

    // Connect filter to main gain & output + reverb
    filter.connect(mainGain);
    mainGain.connect(this.masterGain);
    if (this.reverbNode) {
      const reverbSend = this.ctx.createGain();
      reverbSend.gain.setValueAtTime(0.2, now);
      filter.connect(reverbSend);
      reverbSend.connect(this.reverbNode);
    }

    this.activeVoices.set(note, {
      oscillators,
      gainNodes,
      mainGain,
      filter,
      startTime: Date.now(),
    });
  }

  /**
   * Stop playing a note with natural damper release
   * @param note Note identifier
   * @param releaseTime Duration in seconds to fade out damper (shorter for staccato, longer for legato release)
   */
  public stopNote(note: string, releaseTime = 0.25): number {
    if (!this.ctx) return 0;
    const voice = this.activeVoices.get(note);
    if (!voice) return 0;

    const durationMs = Date.now() - voice.startTime;
    const now = this.ctx.currentTime;

    try {
      voice.mainGain.gain.cancelScheduledValues(now);
      const currentVal = Math.max(voice.mainGain.gain.value, 0.001);
      voice.mainGain.gain.setValueAtTime(currentVal, now);
      voice.mainGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

      setTimeout(() => {
        voice.oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // Already stopped
          }
        });
        voice.gainNodes.forEach(g => g.disconnect());
        voice.filter.disconnect();
        voice.mainGain.disconnect();
      }, (releaseTime + 0.1) * 1000);
    } catch {
      // Fail-safe cleanup
    }

    this.activeVoices.delete(note);
    return durationMs;
  }

  /**
   * Play feedback chime (e.g. Correct note, Perfect Bar, Victory)
   */
  public playFeedbackSound(type: 'perfect' | 'good' | 'miss' | 'metronome' | 'victory') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (type === 'metronome') {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, now);
      g.gain.setValueAtTime(0.3, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
      return;
    }

    if (type === 'perfect') {
      [880, 1108.73, 1318.51].forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        g.gain.setValueAtTime(0.2, now + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
      return;
    }

    if (type === 'good') {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
      return;
    }

    if (type === 'miss') {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
      return;
    }

    if (type === 'victory') {
      // Fanfare chord: C Major arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        g.gain.setValueAtTime(0.35, now + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.8);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.9);
      });
    }
  }
}

export const audioEngine = new PianoAudioEngine();
