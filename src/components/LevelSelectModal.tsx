import React, { useState } from 'react';
import { MUSIC_LEVELS, MusicChallenge, MusicLevel } from '../data/musicData';
import { Trophy, Star, Music, Award, ArrowRight } from 'lucide-react';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChallengeId: string;
  onSelectChallenge: (challenge: MusicChallenge) => void;
  scoresRecord: Record<string, number>; // challengeId -> high score
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  currentChallengeId,
  onSelectChallenge,
  scoresRecord,
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  if (!isOpen) return null;

  const currentLevel: MusicLevel = MUSIC_LEVELS.find(l => l.id === selectedLevelId) || MUSIC_LEVELS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border-2 border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-900/60 via-slate-800 to-teal-900/60 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-teal-400 font-extrabold text-xs tracking-wider uppercase">
                SD TERAMIA · MENU LEVEL SELECTION
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                Pilih Level & 10 Tantangan Musik 10-Bar
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xl border border-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Level Switcher Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex gap-3">
          {MUSIC_LEVELS.map(level => {
            const isSelected = selectedLevelId === level.id;
            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevelId(level.id)}
                className={`flex-1 p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-900/80 to-slate-900 border-teal-400 ring-2 ring-teal-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-teal-400">{level.title}</span>
                    <span className="text-xs bg-teal-950 px-2 py-0.5 rounded text-teal-300 font-semibold border border-teal-500/30">
                      10 Tantangan Musik
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{level.theme}</div>
                </div>
                <Award className={`w-5 h-5 shrink-0 ${isSelected ? 'text-teal-300' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Challenges Grid: 10 Challenges Per Level */}
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white">{currentLevel.title}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{currentLevel.description}</p>
            </div>
            <div className="text-xs text-teal-300 font-bold bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-500/30">
              Total: 10 Birama per Lagu
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentLevel.challenges.map(chal => {
              const isCurrent = currentChallengeId === chal.id;
              const highScore = scoresRecord[chal.id] || 0;
              const hasPlayed = highScore > 0;

              return (
                <div
                  key={chal.id}
                  onClick={() => {
                    onSelectChallenge(chal);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-gradient-to-br from-teal-950/80 to-slate-900 border-teal-400 ring-2 ring-teal-400/40'
                      : 'bg-slate-900/90 border-slate-800 hover:border-teal-500 hover:bg-slate-800/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-mono font-black text-xs flex items-center justify-center border border-teal-500/30">
                          #{chal.challengeNumber}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {chal.bpm} BPM · 10 Bar
                        </span>
                      </div>

                      {hasPlayed && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/30">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{highScore} pts</span>
                        </div>
                      )}
                    </div>

                    <h4 className="text-base font-black text-white group-hover:text-teal-300 transition-colors">
                      {chal.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {chal.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-teal-400/80 font-semibold truncate max-w-[220px]">
                      {chal.learningFocus}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
                      <span>Mainkan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Sentuh kartu tantangan untuk langsung memuat notasi 10 birama ke papan IFP.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            Tutup Menu
          </button>
        </div>
      </div>
    </div>
  );
};
