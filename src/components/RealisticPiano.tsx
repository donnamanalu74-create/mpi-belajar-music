import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PIANO_NOTES, PianoNoteData, audioEngine } from '../utils/audioEngine';

interface RealisticPianoProps {
  onNoteTriggered: (note: string, durationMs: number, velocity: number) => void;
  targetNote?: string; // The note the player is expected to press right now
  isInteractive?: boolean;
}

export type LabelMode = 'all' | 'solfege' | 'letters' | 'none';

export const RealisticPiano: React.FC<RealisticPianoProps> = ({
  onNoteTriggered,
  targetNote,
  isInteractive = true,
}) => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [labelMode, setLabelMode] = useState<LabelMode>('all');
  const [currentDynamicsGauge, setCurrentDynamicsGauge] = useState<{
    note: string;
    durationMs: number;
    category: 'staccato' | 'normal' | 'legato';
  } | null>(null);

  // Active press tracker with timestamps
  const activePressesRef = useRef<Map<string, { startTime: number; timerId?: number }>>(new Map());

  // Split into white and black keys for standard piano layout
  const whiteNotes = PIANO_NOTES.filter(n => !n.isBlack);
  const blackNotes = PIANO_NOTES.filter(n => n.isBlack);

  // Handle Note Press Down
  const handleNoteStart = useCallback((noteItem: PianoNoteData, velocity = 0.85) => {
    if (!isInteractive) return;
    if (activePressesRef.current.has(noteItem.note)) return; // prevent duplicate

    const now = Date.now();
    activePressesRef.current.set(noteItem.note, { startTime: now });

    // Play note via Web Audio
    audioEngine.startNote(noteItem.note, velocity);

    // Update active visual keys
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.add(noteItem.note);
      return next;
    });

    // Start live duration gauge for dynamic teaching
    setCurrentDynamicsGauge({
      note: noteItem.note,
      durationMs: 0,
      category: 'staccato',
    });
  }, [isInteractive]);

  // Handle Note Release (Computes touch duration & informs parent for rhythm/dynamics assessment)
  const handleNoteEnd = useCallback((note: string) => {
    const pressData = activePressesRef.current.get(note);
    if (!pressData) return;

    const durationMs = audioEngine.stopNote(note, 0.25);
    activePressesRef.current.delete(note);

    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });

    // Categorize duration
    const cat = durationMs < 250 ? 'staccato' : durationMs > 550 ? 'legato' : 'normal';
    setCurrentDynamicsGauge(null);

    // Trigger parent callback
    const velocity = cat === 'staccato' ? 0.9 : cat === 'legato' ? 0.75 : 0.85;
    onNoteTriggered(note, durationMs, velocity);
  }, [onNoteTriggered]);

  // Periodically update dynamics meter while any key is being held
  useEffect(() => {
    const interval = setInterval(() => {
      if (activePressesRef.current.size > 0) {
        const firstEntry = activePressesRef.current.entries().next().value;
        if (firstEntry) {
          const [note, data] = firstEntry;
          const dur = Date.now() - data.startTime;
          const cat = dur < 250 ? 'staccato' : dur > 550 ? 'legato' : 'normal';
          setCurrentDynamicsGauge({
            note,
            durationMs: dur,
            category: cat,
          });
        }
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Keyboard accessibility for demonstration and testing
  useEffect(() => {
    const keyMap: Record<string, string> = {
      'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4', 'f': 'F4',
      't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
      'k': 'C5', 'o': 'C#5', 'l': 'D5', 'p': 'D#5', ';': 'E5', "'": 'F5',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const mappedNote = keyMap[e.key.toLowerCase()];
      if (mappedNote) {
        const noteItem = PIANO_NOTES.find(n => n.note === mappedNote);
        if (noteItem) handleNoteStart(noteItem, 0.85);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mappedNote = keyMap[e.key.toLowerCase()];
      if (mappedNote) {
        handleNoteEnd(mappedNote);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleNoteStart, handleNoteEnd]);

  // Calculate black key horizontal offset percentage relative to 14 white keys
  // Total 14 white keys = 100%. Each white key is ~7.1428%
  const getBlackKeyOffsetLeft = (noteName: string): number => {
    // Octave 4
    if (noteName === 'C#4') return (1 - 0.32) * (100 / 14); // between C4 (0) and D4 (1)
    if (noteName === 'D#4') return (2 - 0.28) * (100 / 14); // between D4 (1) and E4 (2)
    if (noteName === 'F#4') return (4 - 0.35) * (100 / 14); // between F4 (3) and G4 (4)
    if (noteName === 'G#4') return (5 - 0.30) * (100 / 14); // between G4 (4) and A4 (5)
    if (noteName === 'A#4') return (6 - 0.25) * (100 / 14); // between A4 (5) and B4 (6)
    
    // Octave 5
    if (noteName === 'C#5') return (8 - 0.32) * (100 / 14); // between C5 (7) and D5 (8)
    if (noteName === 'D#5') return (9 - 0.28) * (100 / 14); // between D5 (8) and E5 (9)
    if (noteName === 'F#5') return (11 - 0.35) * (100 / 14); // between F5 (10) and G5 (11)
    if (noteName === 'G#5') return (12 - 0.30) * (100 / 14); // between G5 (11) and A5 (12)
    if (noteName === 'A#5') return (13 - 0.25) * (100 / 14); // between A5 (12) and B5 (13)
    return 0;
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Piano Control Strip: Dynamics Meter & Label Mode Selector */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-900/80 rounded-xl border border-teal-500/30">
        {/* Dynamic Touch Duration Live Gauge */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-extrabold text-teal-300">
            PENGUKUR DINAMIKA SENTUH:
          </span>
          {currentDynamicsGauge ? (
            <div className="flex items-center gap-2">
              <span className="text-white font-mono font-bold text-sm bg-teal-800 px-2 py-0.5 rounded">
                {currentDynamicsGauge.note} ({currentDynamicsGauge.durationMs}ms)
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-black tracking-wide uppercase ${
                currentDynamicsGauge.category === 'staccato'
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : currentDynamicsGauge.category === 'legato'
                  ? 'bg-emerald-400 text-slate-950 animate-pulse'
                  : 'bg-cyan-400 text-slate-950'
              }`}>
                {currentDynamicsGauge.category === 'staccato' ? '● Staccato (Singkat)' :
                 currentDynamicsGauge.category === 'legato' ? '⌒ Legato (Panjang Ditahan)' : 'Ketukan Normal'}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 text-xs italic">
              Sentuh tuts untuk merasakan perbedaan staccato (lepas kilat) vs legato (tahan lembut)
            </span>
          )}
        </div>

        {/* Label Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <span className="text-slate-400 text-xs font-semibold px-1">Label Tuts:</span>
          {(['all', 'solfege', 'letters', 'none'] as LabelMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setLabelMode(mode)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors whitespace-nowrap ${
                labelMode === mode
                  ? 'bg-teal-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {mode === 'all' ? 'Lengkap' :
               mode === 'solfege' ? 'Solmisasi' :
               mode === 'letters' ? 'Not Balok' : 'Ujian (Hafalan)'}
            </button>
          ))}
        </div>
      </div>

      {/* Realistic Piano Keyboard Body */}
      <div className="relative w-full h-56 sm:h-64 lg:h-72 p-2.5 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 border-4 border-amber-900/60 shadow-2xl overflow-hidden select-none">
        {/* Felt Red Damper Rail on top of keys */}
        <div className="absolute top-2.5 left-2.5 right-2.5 h-3 bg-gradient-to-r from-red-800 via-red-600 to-red-800 shadow-inner z-30 rounded-t-sm" />

        {/* White Keys Container (14 Keys) */}
        <div className="relative w-full h-full flex pt-3">
          {whiteNotes.map(noteItem => {
            const isActive = activeNotes.has(noteItem.note);
            const isTarget = targetNote === noteItem.note;

            return (
              <div
                key={noteItem.note}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  handleNoteStart(noteItem);
                }}
                onPointerUp={() => handleNoteEnd(noteItem.note)}
                onPointerCancel={() => handleNoteEnd(noteItem.note)}
                className={`white-key relative flex-1 h-full cursor-pointer flex flex-col justify-end items-center pb-4 select-none touch-none ${
                  isActive ? 'active ring-4 ring-teal-400 shadow-teal-500/50' : ''
                } ${
                  isTarget && !isActive
                    ? 'ring-4 ring-amber-400/90 bg-amber-50 animate-pulse'
                    : ''
                }`}
              >
                {/* Target Glow Pulse Indicator */}
                {isTarget && (
                  <div className="absolute top-2 w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                )}

                {/* Solfege Name (Do, Re, Mi) */}
                {(labelMode === 'all' || labelMode === 'solfege') && (
                  <span className={`font-black text-2xl sm:text-3xl tracking-tight leading-none ${
                    isActive ? 'text-slate-950 font-black' : 'text-slate-900'
                  }`}>
                    {noteItem.solfege}
                  </span>
                )}

                {/* Solfege Number & Note name */}
                {(labelMode === 'all' || labelMode === 'letters') && (
                  <div className="flex items-center gap-1 mt-1 text-slate-700 font-bold text-xs sm:text-sm">
                    <span>{noteItem.solfegeNum}</span>
                    <span>·</span>
                    <span>{noteItem.note}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Black Keys Layer (10 Keys) */}
        <div className="absolute top-5.5 left-2.5 right-2.5 h-36 sm:h-40 lg:h-44 pointer-events-none z-20">
          {blackNotes.map(noteItem => {
            const isActive = activeNotes.has(noteItem.note);
            const isTarget = targetNote === noteItem.note;
            const leftPercent = getBlackKeyOffsetLeft(noteItem.note);

            return (
              <div
                key={noteItem.note}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  handleNoteStart(noteItem, 0.9);
                }}
                onPointerUp={() => handleNoteEnd(noteItem.note)}
                onPointerCancel={() => handleNoteEnd(noteItem.note)}
                style={{
                  left: `${leftPercent}%`,
                  width: `${(100 / 14) * 0.65}%`,
                }}
                className={`black-key absolute top-0 h-full cursor-pointer pointer-events-auto flex flex-col justify-end items-center pb-3 touch-none select-none ${
                  isActive ? 'active ring-4 ring-teal-300' : ''
                } ${
                  isTarget && !isActive
                    ? 'ring-4 ring-amber-400 bg-amber-900 animate-pulse'
                    : ''
                }`}
              >
                {/* Target indicator */}
                {isTarget && (
                  <div className="absolute top-2 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                )}

                {(labelMode === 'all' || labelMode === 'solfege') && (
                  <span className="text-teal-300 font-black text-base sm:text-lg leading-tight">
                    {noteItem.solfege}
                  </span>
                )}
                {(labelMode === 'all' || labelMode === 'letters') && (
                  <span className="text-slate-300 font-bold text-[10px] sm:text-xs">
                    {noteItem.note}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
