import React from 'react';
import confetti from 'canvas-confetti';
import { Swords, Trophy, RotateCcw, Play, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { narrator } from '../utils/narrator';

export interface TeamScoreData {
  name: string;
  color: 'teal' | 'white';
  score: number;
  pitchAccuracy: number;
  dynamicsAccuracy: number;
  perfectBars: number;
  completed: boolean;
}

interface TeamVsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamA: TeamScoreData;
  teamB: TeamScoreData;
  activeTeamTurn: 'A' | 'B';
  onStartTeamTurn: (team: 'A' | 'B') => void;
  onResetMatch: () => void;
  challengeTitle: string;
}

export const TeamVsModal: React.FC<TeamVsModalProps> = ({
  isOpen,
  onClose,
  teamA,
  teamB,
  activeTeamTurn,
  onStartTeamTurn,
  onResetMatch,
  challengeTitle,
}) => {
  if (!isOpen) return null;

  const bothFinished = teamA.completed && teamB.completed;
  const winner = !bothFinished
    ? null
    : teamA.score > teamB.score
    ? 'A'
    : teamB.score > teamA.score
    ? 'B'
    : 'DRAW';

  const triggerWinnerCelebration = () => {
    audioEngine.playFeedbackSound('victory');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#14b8a6', '#06b6d4', '#ffffff', '#f59e0b'],
    });
    if (winner === 'A') {
      narrator.speak('Selamat kepada Tim Hijau Tosca Harmoni yang telah memenangkan pertandingan musik 10 birama ini! Luar biasa!');
    } else if (winner === 'B') {
      narrator.speak('Selamat kepada Tim Putih Melodi atas kemenangan spektakuler dalam duel musik 10 birama! Hebat sekali!');
    } else {
      narrator.speak('Pertandingan berakhir seri! Kedua tim menunjukkan kekompakan nada dan irama yang sempurna!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-900/60 via-slate-800 to-teal-900/60 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <span className="text-teal-400 font-extrabold text-xs tracking-wider uppercase">
                SD TERAMIA · SISTEM PERTANDINGAN MUSIK VS TIM
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                Duel Harmoni 10 Birama: Tim A vs Tim B
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

        {/* Challenge Banner */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Tantangan Pertandingan:</span>
          <span className="font-extrabold text-teal-300 text-sm truncate max-w-lg">
            {challengeTitle} (10 Birama Penuh)
          </span>
        </div>

        {/* Dual Team Scoreboard Cards */}
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TIM A (Tosca Harmoni) */}
            <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
              activeTeamTurn === 'A' && !teamA.completed
                ? 'bg-gradient-to-b from-teal-950/80 to-slate-900 border-teal-400 ring-4 ring-teal-400/30'
                : 'bg-slate-900/90 border-slate-700/80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/40">
                    TIM A · TOSCA
                  </span>
                  {teamA.completed && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai 10 Bar</span>
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white">{teamA.name}</h3>
                <p className="text-slate-400 text-xs mt-1">Perwakilan Kelas 5 SD TERAMIA</p>

                {/* Score Number Display */}
                <div className="my-5 p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Total Skor Musik</div>
                    <div className="text-4xl font-mono font-black text-teal-400">
                      {teamA.score} <span className="text-base text-slate-400">pts</span>
                    </div>
                  </div>
                  <Trophy className="w-8 h-8 text-teal-400/80" />
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Akurasi Nada (Pitch):</span>
                    <span className="font-mono font-bold text-white">{teamA.pitchAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${teamA.pitchAccuracy}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Akurasi Dinamika & Durasi Sentuh:</span>
                    <span className="font-mono font-bold text-white">{teamA.dynamicsAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${teamA.dynamicsAccuracy}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-1">
                    <span>Birama Sempurna (Perfect):</span>
                    <span className="font-mono font-bold text-amber-300">{teamA.perfectBars} / 10 Bar</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                {!teamA.completed ? (
                  <button
                    onClick={() => {
                      onStartTeamTurn('A');
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Giliran Tim A Main (10 Bar)</span>
                  </button>
                ) : (
                  <div className="py-2.5 text-center text-xs font-bold text-slate-400 bg-slate-950/60 rounded-xl">
                    Performa 10 Birama Tersimpan
                  </div>
                )}
              </div>
            </div>

            {/* TIM B (Putih Melodi) */}
            <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
              activeTeamTurn === 'B' && !teamB.completed
                ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-white ring-4 ring-white/30'
                : 'bg-slate-900/90 border-slate-700/80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full border border-white/40">
                    TIM B · PUTIH
                  </span>
                  {teamB.completed && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai 10 Bar</span>
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white">{teamB.name}</h3>
                <p className="text-slate-400 text-xs mt-1">Perwakilan Kelas 5 SD TERAMIA</p>

                {/* Score Number Display */}
                <div className="my-5 p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Total Skor Musik</div>
                    <div className="text-4xl font-mono font-black text-white">
                      {teamB.score} <span className="text-base text-slate-400">pts</span>
                    </div>
                  </div>
                  <Trophy className="w-8 h-8 text-white/80" />
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Akurasi Nada (Pitch):</span>
                    <span className="font-mono font-bold text-white">{teamB.pitchAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${teamB.pitchAccuracy}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Akurasi Dinamika & Durasi Sentuh:</span>
                    <span className="font-mono font-bold text-white">{teamB.dynamicsAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-full" style={{ width: `${teamB.dynamicsAccuracy}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-1">
                    <span>Birama Sempurna (Perfect):</span>
                    <span className="font-mono font-bold text-amber-300">{teamB.perfectBars} / 10 Bar</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                {!teamB.completed ? (
                  <button
                    onClick={() => {
                      onStartTeamTurn('B');
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Giliran Tim B Main (10 Bar)</span>
                  </button>
                ) : (
                  <div className="py-2.5 text-center text-xs font-bold text-slate-400 bg-slate-950/60 rounded-xl">
                    Performa 10 Birama Tersimpan
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Winner Announcement Card when both teams finished */}
          {bothFinished && (
            <div className="p-6 bg-gradient-to-r from-teal-950 via-slate-900 to-amber-950 rounded-3xl border-2 border-amber-400/60 flex flex-col items-center text-center animate-fadeIn">
              <Trophy className="w-14 h-14 text-amber-400 animate-bounce mb-2" />
              <div className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">
                HASIL AKHIR PERTANDINGAN SENI MUSIK
              </div>
              <h3 className="text-3xl font-black text-white mt-1">
                {winner === 'A' ? '🏆 Pemenang: Tim Hijau Tosca Harmoni!' :
                 winner === 'B' ? '🏆 Pemenang: Tim Putih Melodi!' : '🤝 Hasil Imbang: Kedua Tim Juara Harmoni!'}
              </h3>
              <p className="text-slate-300 text-sm max-w-lg mt-2">
                Kerja sama, ketepatan nada, dan penghayatan dinamika musik kedua tim sangat membanggakan sekolah SD TERAMIA!
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={triggerWinnerCelebration}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Rayakan Kemenangan (Selebrasi)</span>
                </button>
                <button
                  onClick={onResetMatch}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Mulai Pertandingan Baru</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Sistem Penilaian: Akurasi Nada (50%) + Akurasi Dinamika Sentuhan (50%)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            Tutup Scoreboard
          </button>
        </div>
      </div>
    </div>
  );
};
