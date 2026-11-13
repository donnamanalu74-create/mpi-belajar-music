/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { HeaderBar } from './components/HeaderBar';
import { StaffCanvas } from './components/StaffCanvas';
import { RealisticPiano } from './components/RealisticPiano';
import { DeepLearningModal } from './components/DeepLearningModal';
import { TheoryModal } from './components/TheoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { TeamVsModal, TeamScoreData } from './components/TeamVsModal';
import { MUSIC_LEVELS, MusicChallenge } from './data/musicData';
import { audioEngine } from './utils/audioEngine';
import { narrator } from './utils/narrator';
import { Play, Sparkles, Volume2 } from 'lucide-react';

export default function App() {
  // Curriculum & Challenge State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentChallenge, setCurrentChallenge] = useState<MusicChallenge>(
    MUSIC_LEVELS[0].challenges[0]
  );

  // Playback Progress within the 10 Bars
  const [currentBarIndex, setCurrentBarIndex] = useState<number>(0); // 0 to 9
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [barStats, setBarStats] = useState<{ correct: number; total: number }[]>(
    Array(10).fill({ correct: 0, total: 0 })
  );

  // Real-time Visual Echo
  const [lastPlayedNote, setLastPlayedNote] = useState<{
    note: string;
    timestamp: number;
    durationMs: number;
    isCorrect: boolean;
  } | null>(null);

  const [accuracyFeedback, setAccuracyFeedback] = useState<{
    text: string;
    type: 'perfect' | 'good' | 'miss';
    id: number;
  } | null>(null);

  // Modals Visibility
  const [isDeepLearningOpen, setIsDeepLearningOpen] = useState(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isTeamVsOpen, setIsTeamVsOpen] = useState(false);

  // Demo Audio Playback State
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const demoTimerRef = useRef<NodeJS.Timeout[]>([]);

  // VS TEAM Mode State
  const [isVsTeamMode, setIsVsTeamMode] = useState(false);
  const [activeTeamTurn, setActiveTeamTurn] = useState<'A' | 'B'>('A');
  const [teamAData, setTeamAData] = useState<TeamScoreData>({
    name: 'Tim Hijau Tosca Harmoni',
    color: 'teal',
    score: 0,
    pitchAccuracy: 0,
    dynamicsAccuracy: 0,
    perfectBars: 0,
    completed: false,
  });
  const [teamBData, setTeamBData] = useState<TeamScoreData>({
    name: 'Tim Putih Melodi',
    color: 'white',
    score: 0,
    pitchAccuracy: 0,
    dynamicsAccuracy: 0,
    perfectBars: 0,
    completed: false,
  });

  // Metronome Sound Toggle
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const metronomeIntervalRef = useRef<number | null>(null);

  // Active Target Note
  const activeBar = currentChallenge.bars[currentBarIndex] || currentChallenge.bars[0];
  const activeTargetNote = activeBar?.notes[currentNoteIndex]?.note;

  // Welcome narration on initial mount
  useEffect(() => {
    narrator.speak(
      'Halo siswa-siswi kelas 5 SD Teramia! Selamat datang di pembelajaran seni musik piano interaktif 10 birama. Mari mulai bermain nada di layar sentuh!'
    );
  }, []);

  // Metronome tick logic
  useEffect(() => {
    if (isMetronomeActive) {
      const intervalMs = (60000 / currentChallenge.bpm);
      metronomeIntervalRef.current = window.setInterval(() => {
        audioEngine.playFeedbackSound('metronome');
      }, intervalMs);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
    }
    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, [isMetronomeActive, currentChallenge.bpm]);

  // Restart current 10-bar challenge
  const handleRestartChallenge = useCallback(() => {
    setCurrentBarIndex(0);
    setCurrentNoteIndex(0);
    setStreak(0);
    setBarStats(Array(10).fill({ correct: 0, total: 0 }));
    if (!isVsTeamMode) {
      setTotalScore(0);
    }
    narrator.speak(`Mengulang ${currentChallenge.title}. Bersiap memainkan birama pertama!`);
  }, [currentChallenge.title, isVsTeamMode]);

  // Select a new challenge
  const handleSelectChallenge = (challenge: MusicChallenge) => {
    setCurrentChallenge(challenge);
    setCurrentLevelId(challenge.levelId);
    handleRestartChallenge();
    narrator.speak(
      `Memulai ${challenge.title}. Amati not balok pada garis birama dan dengarkan dinamikanya.`
    );
  };

  // Stop Demo Audio
  const handleStopDemo = useCallback(() => {
    demoTimerRef.current.forEach(timer => clearTimeout(timer));
    demoTimerRef.current = [];
    setIsPlayingDemo(false);
  }, []);

  // Play Demo Audio of all 10 Bars automatically
  const handlePlayDemo = useCallback(() => {
    handleStopDemo();
    setIsPlayingDemo(true);
    setCurrentBarIndex(0);
    setCurrentNoteIndex(0);

    let cumulativeTime = 0;
    const msPerBeat = 60000 / currentChallenge.bpm;

    currentChallenge.bars.forEach((bar, bIdx) => {
      bar.notes.forEach((note, nIdx) => {
        const timer = setTimeout(() => {
          setCurrentBarIndex(bIdx);
          setCurrentNoteIndex(nIdx);
          audioEngine.startNote(note.note, bar.dynamic === 'f' ? 1.0 : bar.dynamic === 'p' ? 0.4 : 0.75);
          setTimeout(() => {
            audioEngine.stopNote(note.note, 0.25);
          }, note.targetDurationMs);
        }, cumulativeTime);

        demoTimerRef.current.push(timer);
        cumulativeTime += note.durationBeats * msPerBeat;
      });
    });

    // End of demo
    const finalTimer = setTimeout(() => {
      setIsPlayingDemo(false);
      setCurrentBarIndex(0);
      setCurrentNoteIndex(0);
      narrator.speak('Contoh melodi selesai. Sekarang giliranmu mencoba di tuts piano!');
    }, cumulativeTime + 500);
    demoTimerRef.current.push(finalTimer);
  }, [currentChallenge, handleStopDemo]);

  // Handle Note Evaluation when Student Plays Piano
  const handleNoteTriggered = useCallback(
    (note: string, durationMs: number, _velocity: number) => {
      if (isPlayingDemo) return;

      const expectedNote = activeBar?.notes[currentNoteIndex];
      if (!expectedNote) return;

      const isPitchCorrect = note === expectedNote.note;

      // Check dynamics & articulation compliance
      let isDynamicsCorrect = true;
      if (activeBar.articulation === 'staccato') {
        isDynamicsCorrect = durationMs <= 300; // should be quick staccato
      } else if (activeBar.articulation === 'legato' || expectedNote.duration === '1' || expectedNote.duration === '1/2') {
        isDynamicsCorrect = durationMs >= 350; // should be sustained
      }

      setLastPlayedNote({
        note,
        timestamp: Date.now(),
        durationMs,
        isCorrect: isPitchCorrect,
      });

      if (isPitchCorrect) {
        // Scoring calculation
        let points = 60; // base pitch match
        if (isDynamicsCorrect) points += 40; // dynamics bonus
        const streakBonus = Math.min(30, streak * 5);
        const earned = points + streakBonus;

        setTotalScore(prev => prev + earned);
        setStreak(prev => prev + 1);

        // Feedback display
        if (isDynamicsCorrect) {
          audioEngine.playFeedbackSound('perfect');
          setAccuracyFeedback({
            text: activeBar.articulation === 'staccato' ? 'STACCATO SEMPURNA! (+100)' : 'NADA & DINAMIKA SEMPURNA! (+100)',
            type: 'perfect',
            id: Date.now(),
          });
        } else {
          audioEngine.playFeedbackSound('good');
          setAccuracyFeedback({
            text: 'NADA TEPAT! (+60)',
            type: 'good',
            id: Date.now(),
          });
        }

        // Advance to next note
        if (currentNoteIndex + 1 < activeBar.notes.length) {
          setCurrentNoteIndex(prev => prev + 1);
        } else {
          // Finished this bar!
          if (currentBarIndex + 1 < currentChallenge.bars.length) {
            // Next bar
            const nextBar = currentBarIndex + 1;
            setCurrentBarIndex(nextBar);
            setCurrentNoteIndex(0);

            // Encouragement at halfway bar (Bar 5)
            if (nextBar === 4) {
              narrator.speak('Hebat! Separuh jalan 5 birama telah kamu lewati dengan baik.');
            }
          } else {
            // FINISHED ALL 10 BARS!
            audioEngine.playFeedbackSound('victory');
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#00A896', '#028090', '#38bdf8', '#fbbf24', '#ffffff'],
            });

            // Save High Score
            const finalScore = totalScore + earned;
            setHighScores(prev => ({
              ...prev,
              [currentChallenge.id]: Math.max(prev[currentChallenge.id] || 0, finalScore),
            }));

            // Handle Team VS match turn completion
            if (isVsTeamMode) {
              if (activeTeamTurn === 'A') {
                setTeamAData(prev => ({
                  ...prev,
                  score: finalScore,
                  pitchAccuracy: 95,
                  dynamicsAccuracy: 88,
                  perfectBars: 8,
                  completed: true,
                }));
                narrator.speak(
                  'Bagus sekali Tim Hijau Tosca Harmoni! Skor kalian telah tercatat. Sekarang giliran Tim Putih Melodi!'
                );
                setActiveTeamTurn('B');
                setTotalScore(0);
                setCurrentBarIndex(0);
                setCurrentNoteIndex(0);
                setIsTeamVsOpen(true);
              } else {
                setTeamBData(prev => ({
                  ...prev,
                  score: finalScore,
                  pitchAccuracy: 92,
                  dynamicsAccuracy: 90,
                  perfectBars: 9,
                  completed: true,
                }));
                narrator.speak(
                  'Luar biasa Tim Putih Melodi! Kedua tim telah menyelesaikan 10 birama. Mari kita lihat pemenang duel musik ini!'
                );
                setIsTeamVsOpen(true);
              }
            } else {
              narrator.speak(
                'Selamat! Kamu berhasil memainkan 10 birama lagu ini secara tuntas! Buka menu Pembelajaran Mendalam untuk merefleksi hasil bermainmu.'
              );
            }
          }
        }
      } else {
        // Missed pitch
        audioEngine.playFeedbackSound('miss');
        setStreak(0);
        setAccuracyFeedback({
          text: `COBA LAGI (${expectedNote.note} / ${expectedNote.solfege})`,
          type: 'miss',
          id: Date.now(),
        });
      }
    },
    [
      isPlayingDemo,
      activeBar,
      currentNoteIndex,
      currentBarIndex,
      currentChallenge,
      streak,
      totalScore,
      isVsTeamMode,
      activeTeamTurn,
    ]
  );

  // Start Team Turn from VS Modal
  const handleStartTeamTurn = (team: 'A' | 'B') => {
    setActiveTeamTurn(team);
    setIsVsTeamMode(true);
    setCurrentBarIndex(0);
    setCurrentNoteIndex(0);
    setTotalScore(0);
    setStreak(0);
    narrator.speak(
      `Giliran ${team === 'A' ? 'Tim Hijau Tosca Harmoni' : 'Tim Putih Melodi'}. Mainkan 10 birama sebaik mungkin untuk mengumpulkan skor tertinggi!`
    );
  };

  // Reset Team Match
  const handleResetMatch = () => {
    setTeamAData(prev => ({ ...prev, score: 0, pitchAccuracy: 0, dynamicsAccuracy: 0, perfectBars: 0, completed: false }));
    setTeamBData(prev => ({ ...prev, score: 0, pitchAccuracy: 0, dynamicsAccuracy: 0, perfectBars: 0, completed: false }));
    setActiveTeamTurn('A');
    setTotalScore(0);
    setCurrentBarIndex(0);
    setCurrentNoteIndex(0);
    narrator.speak('Pertandingan tim baru dimulai! Tim A mendapat giliran pertama.');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      {/* 1. TOP HEADER BAR */}
      <HeaderBar
        schoolName="SD TERAMIA"
        levelTitle={`Level ${currentLevelId}: ${MUSIC_LEVELS.find(l => l.id === currentLevelId)?.title || ''}`}
        challengeTitle={currentChallenge.title}
        challengeNumber={currentChallenge.challengeNumber}
        totalScore={totalScore}
        isVsTeamMode={isVsTeamMode}
        activeTeam={activeTeamTurn}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenDeepLearning={() => setIsDeepLearningOpen(true)}
        onOpenTeamVs={() => setIsTeamVsOpen(true)}
        onRestartCurrentChallenge={handleRestartChallenge}
      />

      {/* 2. MAIN CENTER STAGE: NOTATION STAFF & LIVE CONTEXT (Flexible Viewport Presence) */}
      <main className="flex-1 w-full p-3 flex flex-col justify-between overflow-hidden">
        {/* Top Control Strip: Metronome, Tempo, Guide, and Pedagogy Tip */}
        <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/80 rounded-2xl border border-teal-500/30 mb-2 shrink-0">
          <div className="flex items-center gap-3">
            {/* Metronome Toggle */}
            <button
              onClick={() => setIsMetronomeActive(prev => !prev)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${
                isMetronomeActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <span>Metronom: {isMetronomeActive ? 'AKTIF (Ketukan)' : 'MATI'}</span>
              <span className="font-mono bg-slate-950/40 px-1.5 py-0.5 rounded text-[11px]">
                {currentChallenge.bpm} BPM
              </span>
            </button>

            {/* Streak Counter */}
            {streak > 1 && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-xl text-xs font-extrabold animate-pulse">
                <span>🔥 Kombo:</span>
                <span className="text-sm font-mono">{streak}x</span>
              </div>
            )}
          </div>

          {/* Educational Quick Tip for Grade 5 SD */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="text-teal-400 font-bold">Tips Musik Guru Teramia:</span>
            <span className="text-slate-300 hidden md:inline">
              {activeBar?.articulation === 'staccato'
                ? 'Birama ini berartikulasi Staccato: Sentuh tuts lalu segera angkat dengan lincah!'
                : activeBar?.articulation === 'legato'
                ? 'Birama ini berartikulasi Legato: Tahan tuts mengalun halus tanpa jeda.'
                : 'Jaga ketukan konstan 1 detik per not seperempat untuk menghasilkan melodi harmonis.'}
            </span>
          </div>

          {/* Quick Demo Button */}
          <div className="flex items-center gap-2">
            {!isPlayingDemo ? (
              <button
                onClick={handlePlayDemo}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Dengarkan Lagu Guru</span>
              </button>
            ) : (
              <button
                onClick={handleStopDemo}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse"
              >
                <span>Hentikan Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Musical Staff Canvas (5 Lines + Treble Clef + Moving Notes) */}
        <div className="flex-1 w-full min-h-[170px] max-h-[220px]">
          <StaffCanvas
            currentBarIndex={currentBarIndex}
            currentNoteIndex={currentNoteIndex}
            bars={currentChallenge.bars}
            lastPlayedNote={lastPlayedNote}
            isPlayingDemo={isPlayingDemo}
            accuracyFeedback={accuracyFeedback}
          />
        </div>

        {/* 3. REALISTIC JUMBO PIANO KEYBOARD (Touch Friendly for 75" Hisense IFP) */}
        <div className="w-full mt-2">
          <RealisticPiano
            onNoteTriggered={handleNoteTriggered}
            targetNote={activeTargetNote}
            isInteractive={!isPlayingDemo}
          />
        </div>
      </main>

      {/* MODALS */}
      {/* 1. Deep Learning Pedagogy Modal (Menganalisis, Mengaplikasi, Merefleksi) */}
      <DeepLearningModal
        isOpen={isDeepLearningOpen}
        onClose={() => setIsDeepLearningOpen(false)}
        challenge={currentChallenge}
        onPlayDemo={handlePlayDemo}
        onStopDemo={handleStopDemo}
        isPlayingDemo={isPlayingDemo}
        bestScore={highScores[currentChallenge.id] || 0}
        lastAccuracy={92}
      />

      {/* 2. Concise Music Theory Modal */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      {/* 3. Level Selection Modal (10 Challenges per Level) */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        currentChallengeId={currentChallenge.id}
        onSelectChallenge={handleSelectChallenge}
        scoresRecord={highScores}
      />

      {/* 4. Team VS Match Modal */}
      <TeamVsModal
        isOpen={isTeamVsOpen}
        onClose={() => setIsTeamVsOpen(false)}
        teamA={teamAData}
        teamB={teamBData}
        activeTeamTurn={activeTeamTurn}
        onStartTeamTurn={handleStartTeamTurn}
        onResetMatch={handleResetMatch}
        challengeTitle={currentChallenge.title}
      />
    </div>
  );
}
