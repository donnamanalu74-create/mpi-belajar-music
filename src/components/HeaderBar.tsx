import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  BookOpen,
  Trophy,
  Swords,
  Sparkles,
  School,
  RotateCcw,
} from 'lucide-react';
import { narrator } from '../utils/narrator';

interface HeaderBarProps {
  schoolName: string;
  levelTitle: string;
  challengeTitle: string;
  challengeNumber: number;
  totalScore: number;
  isVsTeamMode: boolean;
  activeTeam?: 'A' | 'B';
  onOpenLevelSelect: () => void;
  onOpenTheory: () => void;
  onOpenDeepLearning: () => void;
  onOpenTeamVs: () => void;
  onRestartCurrentChallenge: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  schoolName,
  levelTitle,
  challengeTitle,
  challengeNumber,
  totalScore,
  isVsTeamMode,
  activeTeam,
  onOpenLevelSelect,
  onOpenTheory,
  onOpenDeepLearning,
  onOpenTeamVs,
  onRestartCurrentChallenge,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [narratorEnabled, setNarratorEnabled] = useState(true);

  // Monitor fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Force Fullscreen for 75" Hisense IFP
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch {
      // Fallback
    }
  };

  const toggleNarrator = () => {
    const next = !narratorEnabled;
    setNarratorEnabled(next);
    narrator.setEnabled(next);
    if (next) {
      narrator.speak('Suara panduan narator guru SD Teramia diaktifkan.');
    }
  };

  const repeatNarration = () => {
    narrator.speak(
      `Selamat belajar di ${schoolName}. Sekarang kita memainkan ${challengeTitle}. Tekan tuts piano dengan dinamika yang tepat!`
    );
  };

  return (
    <header className="w-full bg-slate-900/95 border-b-2 border-teal-500/40 px-4 py-2 flex items-center justify-between select-none z-30 shrink-0">
      {/* Zone 1: School Identity & Brand Mark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 border-2 border-teal-300">
          <School className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-xl tracking-tight font-display">
              {schoolName}
            </span>
            <span className="text-[11px] font-black bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/40 uppercase">
              KELAS 5 SD
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Media Belajar & Game Piano Interaktif (IFP 75")
          </div>
        </div>
      </div>

      {/* Zone 2: Current Track Badge & Actions */}
      <div className="flex items-center gap-2">
        {/* Active Challenge Indicator with Click to Open Level Selection */}
        <button
          onClick={onOpenLevelSelect}
          className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-left border border-slate-700 hover:border-teal-400 transition-all flex items-center gap-3 shadow group"
        >
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-mono font-black text-xs flex items-center justify-center border border-teal-500/30">
            #{challengeNumber}
          </div>
          <div className="max-w-[240px] truncate">
            <div className="text-[10px] uppercase font-bold text-teal-400 tracking-wider truncate">
              {levelTitle}
            </div>
            <div className="text-sm font-extrabold text-white truncate group-hover:text-teal-300">
              {challengeTitle}
            </div>
          </div>
        </button>

        {/* Deep Learning Button */}
        <button
          onClick={onOpenDeepLearning}
          className="h-11 px-3.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-black flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Pembelajaran Mendalam</span>
        </button>

        {/* Music Theory Button */}
        <button
          onClick={onOpenTheory}
          className="h-11 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Materi Musik</span>
        </button>

        {/* Team VS Mode Trigger */}
        <button
          onClick={onOpenTeamVs}
          className={`h-11 px-4 rounded-xl border font-black text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
            isVsTeamMode
              ? activeTeam === 'A'
                ? 'bg-teal-500 text-slate-950 border-teal-300 ring-2 ring-teal-400 shadow-lg'
                : 'bg-white text-slate-950 border-white ring-2 ring-slate-200 shadow-lg'
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>
            {isVsTeamMode
              ? `Mode Tanding: ${activeTeam === 'A' ? 'Giliran Tim A (Tosca)' : 'Giliran Tim B (Putih)'}`
              : 'Mode Tanding VS TIM'}
          </span>
        </button>

        {/* Restart Challenge Button */}
        <button
          onClick={onRestartCurrentChallenge}
          title="Ulangi Tantangan 10 Bar"
          className="h-11 w-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Zone 3: Scoreboard, Narrator Voice & Fullscreen Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Score Pill */}
        <div className="h-11 px-4 bg-slate-950/80 rounded-xl border border-teal-500/40 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400 font-bold uppercase">Skor:</span>
          <span className="font-mono font-black text-xl text-teal-300">{totalScore}</span>
        </div>

        {/* Voice Narrator Control */}
        <button
          onClick={toggleNarrator}
          title={narratorEnabled ? 'Matikan Suara Guru' : 'Aktifkan Suara Guru'}
          className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors border ${
            narratorEnabled
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {narratorEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* Replay Narration Guide */}
        <button
          onClick={repeatNarration}
          title="Dengarkan Ulang Panduan Narator"
          className="h-11 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors whitespace-nowrap"
        >
          Ulangi Panduan
        </button>

        {/* Fullscreen Button (Crucial for 75" Hisense IFP) */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh IFP 75"'}
          className="h-11 px-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition-colors whitespace-nowrap"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{isFullscreen ? 'Keluar Full' : 'Layar Penuh IFP'}</span>
        </button>
      </div>
    </header>
  );
};
