import React, { useMemo } from 'react';
import { NOTE_MAP } from '../utils/audioEngine';
import { BarComposition, NoteItem } from '../data/musicData';

interface StaffCanvasProps {
  currentBarIndex: number; // 0 to 9
  currentNoteIndex: number; // index within current bar
  bars: BarComposition[];
  lastPlayedNote: { note: string; timestamp: number; durationMs: number; isCorrect: boolean } | null;
  isPlayingDemo: boolean;
  accuracyFeedback: { text: string; type: 'perfect' | 'good' | 'miss'; id: number } | null;
}

export const StaffCanvas: React.FC<StaffCanvasProps> = ({
  currentBarIndex,
  currentNoteIndex,
  bars,
  lastPlayedNote,
  isPlayingDemo,
  accuracyFeedback,
}) => {
  // Staff geometry calculations:
  // 5 lines spaced by 16px. Line 1 (bottom line E4) is at y=104, Line 5 (top line F5) is at y=40.
  // Line 1: E4 (y=104)
  // Spasi 1: F4 (y=96)
  // Line 2: G4 (y=88) - Treble clef curl center
  // Spasi 2: A4 (y=80)
  // Line 3: B4 (y=72)
  // Spasi 3: C5 (y=64)
  // Line 4: D5 (y=56)
  // Spasi 4: E5 (y=48)
  // Line 5: F5 (y=40)
  // Line bantu bawah (Middle C / C4): y=120
  // D4 (bawah garis 1): y=112
  // G5 (atas garis 5): y=32
  // A5 (garis bantu atas): y=24

  const getNoteY = (noteName: string): number => {
    const data = NOTE_MAP.get(noteName);
    if (!data) return 104;
    // C4 is staffPosition 0 -> y=120
    // Each step up is 8px (step = half line spacing)
    return 120 - data.staffPosition * 8;
  };

  // Currently active bar
  const activeBar = bars[currentBarIndex] || bars[0];
  const activeNote = activeBar?.notes[currentNoteIndex];

  // Visible window: show current bar and next bar for seamless reading ahead on 75" IFP
  const visibleBars = useMemo(() => {
    const list: { bar: BarComposition; index: number }[] = [];
    // Show current bar and upcoming 1-2 bars
    for (let i = currentBarIndex; i < Math.min(bars.length, currentBarIndex + 3); i++) {
      list.push({ bar: bars[i], index: i });
    }
    // If at the end, pad with previous
    if (list.length < 2 && currentBarIndex > 0) {
      list.unshift({ bar: bars[currentBarIndex - 1], index: currentBarIndex - 1 });
    }
    return list;
  }, [bars, currentBarIndex]);

  return (
    <div className="relative w-full h-full bg-slate-900/90 rounded-2xl border-2 border-teal-500/30 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
      {/* Top Banner: Status & Bar Counter for 10-meter readability */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 font-extrabold text-lg tracking-wider uppercase">BIRAMA AKTIF:</span>
            <span className="bg-teal-600 text-white font-mono font-black text-2xl px-3 py-1 rounded-lg shadow-inner">
              {currentBarIndex + 1} <span className="text-teal-200 text-lg">/ 10</span>
            </span>
          </div>

          {/* Dynamic Marking for current bar */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-sm font-semibold">Dinamika:</span>
            <span className={`font-serif italic font-extrabold text-xl ${
              activeBar?.dynamic === 'f' ? 'text-rose-400 font-black text-2xl' :
              activeBar?.dynamic === 'p' ? 'text-amber-300' : 'text-emerald-300'
            }`}>
              {activeBar?.dynamic === 'f' ? 'f (Forte / Kuat)' :
               activeBar?.dynamic === 'p' ? 'p (Piano / Lembut)' : 'mf (Mezzo-Forte / Sedang)'}
            </span>
          </div>

          {/* Articulation Marking */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-sm font-semibold">Artikulasi:</span>
            <span className="text-cyan-300 font-bold text-sm tracking-wide">
              {activeBar?.articulation === 'staccato' ? '● Staccato (Sentuh Singkat <250ms)' :
               activeBar?.articulation === 'legato' ? '⌒ Legato (Sentuh Panjang Tahan)' : 'Normal (Ketukan Mantap)'}
            </span>
          </div>
        </div>

        {/* Real-time Target Prompt */}
        <div className="flex items-center gap-3">
          {isPlayingDemo ? (
            <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/40 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-sm">Sedang Memutar Contoh Audio Guru...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-bold">NADA BERIKUTNYA:</span>
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-2xl px-4 py-1 rounded-xl shadow-lg flex items-center gap-2">
                <span>{activeNote?.note || '-'}</span>
                <span className="text-slate-900 text-lg font-bold">({activeNote?.solfege || '-'})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Staff SVG Area */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2">
        <svg
          viewBox="0 0 1000 160"
          className="w-full h-full max-h-[190px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filters */}
            <filter id="teal-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#14b8a6" floodOpacity="0.8" />
            </filter>
            <filter id="active-pulse" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Background Staff Area with soft paper parchment look */}
          <rect x="20" y="15" width="960" height="130" rx="12" fill="#0d1f2d" stroke="#1e3a52" strokeWidth="2" />

          {/* 5 Staff Lines */}
          {[40, 56, 72, 88, 104].map((y, idx) => (
            <line
              key={idx}
              x1="30"
              y1={y}
              x2="970"
              y2={y}
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          {/* Treble Clef Graphic at left */}
          <g transform="translate(42, 28) scale(0.72)">
            {/* Elegant Treble Clef (Kunci G) path */}
            <path
              d="M18,92 C14,88 12,80 16,72 C22,60 36,54 36,36 C36,22 28,12 22,6 C18,2 14,0 12,0 C10,0 8,2 8,6 C8,18 20,38 20,52 C20,70 4,80 4,96 C4,112 20,126 36,126 C52,126 64,114 64,96 C64,78 50,66 34,66 C28,66 22,68 18,72 M18,30 L18,136 M18,136 C18,144 12,150 4,148"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Lower Treble clef curl dot */}
            <circle cx="4" cy="148" r="6" fill="#38bdf8" />
            {/* Center G note circle */}
            <circle cx="28" cy="88" r="4" fill="#38bdf8" />
          </g>

          {/* Time Signature: 4/4 */}
          <g transform="translate(95, 45)" className="font-serif font-black">
            <text x="0" y="24" fill="#f8fafc" fontSize="32" fontWeight="900" textAnchor="middle">4</text>
            <text x="0" y="54" fill="#f8fafc" fontSize="32" fontWeight="900" textAnchor="middle">4</text>
          </g>

          {/* Render Visible Bars with Bar Lines and Notes */}
          {visibleBars.map((item, colIdx) => {
            const isCurrentBar = item.index === currentBarIndex;
            // Distribute across horizontal canvas: colIdx 0, 1, 2
            const startX = 140 + colIdx * 270;
            const barWidth = 260;

            return (
              <g key={`bar-${item.index}`}>
                {/* Bar boundary rectangle highlight if active */}
                {isCurrentBar && (
                  <rect
                    x={startX - 10}
                    y="22"
                    width={barWidth + 10}
                    height="116"
                    rx="8"
                    fill="rgba(20, 184, 166, 0.12)"
                    stroke="rgba(20, 184, 166, 0.5)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Bar Number Label */}
                <text
                  x={startX + 10}
                  y="34"
                  fill={isCurrentBar ? '#2dd4bf' : '#94a3b8'}
                  fontSize="13"
                  fontWeight="bold"
                >
                  Birama {item.bar.barNumber}
                </text>

                {/* Dynamic & Articulation Indicator inside bar */}
                <text
                  x={startX + barWidth - 15}
                  y="34"
                  fill={item.bar.dynamic === 'f' ? '#f87171' : item.bar.dynamic === 'p' ? '#fde047' : '#6ee7b7'}
                  fontSize="12"
                  fontStyle="italic"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {item.bar.dynamic} {item.bar.articulation === 'staccato' ? '· stacc.' : ''}
                </text>

                {/* Bar Line (Garis Birama) */}
                <line
                  x1={startX + barWidth}
                  y1="40"
                  x2={startX + barWidth}
                  y2="104"
                  stroke="#94a3b8"
                  strokeWidth="3"
                />

                {/* Notes inside this bar */}
                {item.bar.notes.map((noteItem, nIdx) => {
                  const isCurrentNote = isCurrentBar && nIdx === currentNoteIndex;
                  const isPastNote = isCurrentBar && nIdx < currentNoteIndex;
                  // Horizontal position of note inside the bar
                  const noteSpacing = barWidth / (item.bar.notes.length + 1);
                  const noteX = startX + (nIdx + 1) * noteSpacing;
                  const noteY = getNoteY(noteItem.note);

                  const isC4 = noteItem.note === 'C4'; // needs ledger line at y=120
                  const isA5 = noteItem.note === 'A5'; // needs top ledger line at y=24

                  return (
                    <g key={noteItem.id} className="cursor-pointer transition-all duration-150">
                      {/* Ledger Line for C4 (Middle C) */}
                      {isC4 && (
                        <line
                          x1={noteX - 16}
                          y1="120"
                          x2={noteX + 16}
                          y2="120"
                          stroke={isCurrentNote ? '#38bdf8' : '#94a3b8'}
                          strokeWidth="2.5"
                        />
                      )}
                      {/* Top Ledger Line for A5 */}
                      {isA5 && (
                        <line
                          x1={noteX - 16}
                          y1="24"
                          x2={noteX + 16}
                          y2="24"
                          stroke={isCurrentNote ? '#38bdf8' : '#94a3b8'}
                          strokeWidth="2.5"
                        />
                      )}

                      {/* Staccato dot if applicable */}
                      {item.bar.articulation === 'staccato' && (
                        <circle
                          cx={noteX}
                          cy={noteY - 14}
                          r="2.5"
                          fill={isCurrentNote ? '#38bdf8' : '#cbd5e1'}
                        />
                      )}

                      {/* Note Head (Oval slanted note head) */}
                      <ellipse
                        cx={noteX}
                        cy={noteY}
                        rx="8"
                        ry="6"
                        transform={`rotate(-25 ${noteX} ${noteY})`}
                        fill={
                          isCurrentNote
                            ? '#2dd4bf'
                            : isPastNote
                            ? '#059669'
                            : noteItem.duration === '1'
                            ? '#0f172a'
                            : noteItem.duration === '1/2'
                            ? '#0f172a'
                            : '#f8fafc'
                        }
                        stroke={
                          isCurrentNote
                            ? '#5eead4'
                            : isPastNote
                            ? '#34d399'
                            : '#f8fafc'
                        }
                        strokeWidth={noteItem.duration === '1' || noteItem.duration === '1/2' ? '2.5' : '1'}
                        filter={isCurrentNote ? 'url(#active-pulse)' : undefined}
                      />

                      {/* Note Stem (Tangkai Not) - only for half, quarter, eighth */}
                      {noteItem.duration !== '1' && (
                        <line
                          x1={noteX + 6}
                          y1={noteY}
                          x2={noteX + 6}
                          y2={noteY - 30}
                          stroke={isCurrentNote ? '#2dd4bf' : isPastNote ? '#34d399' : '#f8fafc'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Eighth note flag (bendera not 1/8) */}
                      {noteItem.duration === '1/8' && (
                        <path
                          d={`M${noteX + 6},${noteY - 30} C${noteX + 14},${noteY - 26} ${noteX + 16},${noteY - 16} ${noteX + 14},${noteY - 10}`}
                          fill="none"
                          stroke={isCurrentNote ? '#2dd4bf' : '#f8fafc'}
                          strokeWidth="2.5"
                        />
                      )}

                      {/* Active target cursor halo / arrow pointing down to the active note */}
                      {isCurrentNote && (
                        <g>
                          <polygon
                            points={`${noteX},${noteY - 38} ${noteX - 6},${noteY - 48} ${noteX + 6},${noteY - 48}`}
                            fill="#38bdf8"
                            className="animate-bounce"
                          />
                        </g>
                      )}

                      {/* Solfege & Note text below note for educational clarity */}
                      <text
                        x={noteX}
                        y={noteY > 80 ? 142 : 142}
                        fill={isCurrentNote ? '#2dd4bf' : '#cbd5e1'}
                        fontSize="13"
                        fontWeight={isCurrentNote ? '900' : 'bold'}
                        textAnchor="middle"
                      >
                        {noteItem.solfege}
                      </text>
                      <text
                        x={noteX}
                        y="154"
                        fill={isCurrentNote ? '#38bdf8' : '#94a3b8'}
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {noteItem.note}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Real-time Pressed Note Visual Echo (Shows when student presses any key) */}
          {lastPlayedNote && Date.now() - lastPlayedNote.timestamp < 1200 && (
            <g transform="translate(910, 0)">
              <rect x="0" y="24" width="70" height="110" rx="8" fill="rgba(30, 41, 59, 0.85)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="35" y="44" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">DITEKAN:</text>
              <text x="35" y="74" fill="#38bdf8" fontSize="20" fontWeight="900" textAnchor="middle">
                {lastPlayedNote.note}
              </text>
              <text x="35" y="96" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">
                {NOTE_MAP.get(lastPlayedNote.note)?.solfege || ''}
              </text>
              <text x="35" y="118" fill="#e2e8f0" fontSize="10" textAnchor="middle">
                {lastPlayedNote.durationMs}ms
              </text>
            </g>
          )}
        </svg>

        {/* Floating Feedback Badge (Sempurna / Bagus / Miss) */}
        {accuracyFeedback && (
          <div
            key={accuracyFeedback.id}
            className={`absolute top-2 right-24 px-5 py-2 rounded-xl text-xl font-black shadow-2xl uppercase tracking-wider transform transition-all duration-200 animate-bounce ${
              accuracyFeedback.type === 'perfect'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 border-2 border-teal-200'
                : accuracyFeedback.type === 'good'
                ? 'bg-cyan-500 text-slate-950 border-2 border-cyan-200'
                : 'bg-rose-500 text-white border-2 border-rose-300'
            }`}
          >
            {accuracyFeedback.text}
          </div>
        )}
      </div>

      {/* Bottom Bar: 10-Bar Mini Progress Strip */}
      <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-700/60 text-xs">
        <span className="text-slate-400 font-bold whitespace-nowrap">Progres 10 Bar:</span>
        <div className="flex items-center gap-1.5 flex-1 max-w-4xl mx-3">
          {bars.map((b, idx) => {
            const isDone = idx < currentBarIndex;
            const isCurrent = idx === currentBarIndex;
            return (
              <div
                key={b.barNumber}
                className={`flex-1 h-3 rounded transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 shadow-sm'
                    : isCurrent
                    ? 'bg-teal-400 ring-2 ring-teal-200 animate-pulse'
                    : 'bg-slate-700/80'
                }`}
                title={`Birama ${b.barNumber}: ${b.label}`}
              />
            );
          })}
        </div>
        <span className="text-teal-300 font-mono font-bold">
          {Math.round(((currentBarIndex + currentNoteIndex / (activeBar?.notes.length || 1)) / 10) * 100)}% Selesai
        </span>
      </div>
    </div>
  );
};
