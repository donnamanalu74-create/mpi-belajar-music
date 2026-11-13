import React, { useState } from 'react';
import { MusicChallenge } from '../data/musicData';
import { narrator } from '../utils/narrator';
import { BookOpen, Sparkles, HelpCircle, Play, Square, CheckCircle } from 'lucide-react';

interface DeepLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: MusicChallenge;
  onPlayDemo: () => void;
  onStopDemo: () => void;
  isPlayingDemo: boolean;
  bestScore?: number;
  lastAccuracy?: number;
}

export const DeepLearningModal: React.FC<DeepLearningModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onPlayDemo,
  onStopDemo,
  isPlayingDemo,
  bestScore = 0,
  lastAccuracy = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'analisis' | 'aplikasi' | 'refleksi'>('analisis');
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const handleReadAloud = (text: string) => {
    narrator.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-900/60 via-slate-800 to-teal-900/60 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-teal-400 font-extrabold text-xs tracking-wider uppercase">
                PEMBELAJARAN MENDALAM · SENI MUSIK SD TERAMIA
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                {challenge.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPlayingDemo) onStopDemo();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xl border border-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation: Menganalisis - Mengaplikasi - Merefleksi */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-2">
          <button
            onClick={() => {
              setActiveTab('analisis');
              handleReadAloud(`Mari menganalisis komposisi musik 10 birama ini. ${challenge.analysisGuide}`);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2 ${
              activeTab === 'analisis'
                ? 'bg-teal-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>1. Menganalisis (Membedah Lagu)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('aplikasi');
              handleReadAloud(`Waktunya mengaplikasi. Mainkan 10 birama dengan dinamika dan tempo yang stabil.`);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2 ${
              activeTab === 'aplikasi'
                ? 'bg-teal-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>2. Mengaplikasi (Praktik Piano)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('refleksi');
              handleReadAloud(`Tahap ketiga adalah merefleksi pengalaman bermain musikmu bersama tim dan guru.`);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2 ${
              activeTab === 'refleksi'
                ? 'bg-teal-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>3. Merefleksi (Evaluasi Diri)</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
          {/* TAB 1: MENGANALISIS */}
          {activeTab === 'analisis' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-800/70 p-5 rounded-2xl border border-teal-500/20">
                <h3 className="text-lg font-bold text-teal-300 mb-2 flex items-center gap-2">
                  <span>🎯 Fokus Analisis Musik:</span>
                </h3>
                <p className="text-slate-200 text-base leading-relaxed">
                  {challenge.learningFocus}
                </p>
                <div className="mt-3 p-3 bg-teal-950/40 rounded-xl border border-teal-500/30 text-teal-200 text-sm">
                  <strong>Panduan Guru SD Teramia:</strong> {challenge.analysisGuide}
                </div>
              </div>

              {/* Composition Structure Breakdown (10 Bars Overview) */}
              <div className="bg-slate-800/70 p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-white text-lg">
                    Struktur Komposisi 10 Birama (Partitur):
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Tempo:</span>
                    <span className="font-mono font-bold text-teal-300 bg-slate-900 px-2 py-0.5 rounded">
                      {challenge.bpm} BPM
                    </span>
                    <span className="text-xs text-slate-400 ml-2">Birama:</span>
                    <span className="font-mono font-bold text-teal-300 bg-slate-900 px-2 py-0.5 rounded">
                      {challenge.timeSignature}
                    </span>
                  </div>
                </div>

                {/* 10 Bar Grid Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {challenge.bars.map((bar) => (
                    <div
                      key={bar.barNumber}
                      className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 hover:border-teal-400 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-teal-400">Bar {bar.barNumber}</span>
                        <span className={`text-xs font-serif italic font-bold px-1.5 py-0.2 rounded ${
                          bar.dynamic === 'f' ? 'bg-rose-900/60 text-rose-300' :
                          bar.dynamic === 'p' ? 'bg-amber-900/60 text-amber-300' : 'bg-teal-900/60 text-teal-300'
                        }`}>
                          {bar.dynamic}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {bar.notes.map((n, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-200"
                          >
                            {n.solfege}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Playback Button */}
              <div className="flex items-center justify-between bg-gradient-to-r from-teal-900/40 to-slate-900 p-4 rounded-2xl border border-teal-500/30">
                <div>
                  <h4 className="font-bold text-white text-base">Dengarkan Melodi Komposisi Ini (Audio Guru)</h4>
                  <p className="text-slate-400 text-xs">
                    Dengarkan pola nada sebelum kamu mencobanya di tuts piano.
                  </p>
                </div>
                {isPlayingDemo ? (
                  <button
                    onClick={onStopDemo}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-colors"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Hentikan Audio</span>
                  </button>
                ) : (
                  <button
                    onClick={onPlayDemo}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Putar Audio Guru</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MENGAPLIKASI */}
          {activeTab === 'aplikasi' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-800/70 p-5 rounded-2xl border border-teal-500/20">
                <h3 className="text-lg font-bold text-teal-300 mb-2">
                  🎹 Petunjuk Praktik di Layar Sentuh IFP:
                </h3>
                <ul className="space-y-3 text-slate-200 text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">1</span>
                    <span><strong>Perhatikan Garis Paranada:</strong> Amati kursor nada yang bersinar dan indikator birama 1 sampai 10.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">2</span>
                    <span><strong>Respon Dinamika Sentuh:</strong> Pada birama bertanda <em>Staccato</em>, sentuh tuts lalu segera angkat jarimu (&lt;250ms). Pada birama <em>Legato</em> atau not panjang, tahan tuts lebih lama.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">3</span>
                    <span><strong>Gunakan Jari yang Tepat:</strong> Gunakan kedua tangan secara bergantian di layar datar IFP 75 inci untuk melatih ketangkasan motorik musik.</span>
                  </li>
                </ul>
              </div>

              {/* Score Status Snapshot */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 flex flex-col items-center">
                  <span className="text-xs text-slate-400 uppercase font-bold">Skor Tertinggi Kamu</span>
                  <span className="text-3xl font-black text-teal-400 font-mono mt-1">{bestScore} Poin</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 flex flex-col items-center">
                  <span className="text-xs text-slate-400 uppercase font-bold">Akurasi Terakhir</span>
                  <span className="text-3xl font-black text-emerald-400 font-mono mt-1">{lastAccuracy}%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEREFLEKSI */}
          {activeTab === 'refleksi' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-800/70 p-5 rounded-2xl border border-teal-500/20">
                <h3 className="text-lg font-bold text-teal-300 mb-2 flex items-center gap-2">
                  <span>💡 Pertanyaan Refleksi Siswa SD Teramia:</span>
                </h3>
                <p className="text-white text-base font-semibold mb-4">
                  "{challenge.reflectionQuestion}"
                </p>

                {/* Interactive Reflection Options */}
                <div className="space-y-2">
                  {[
                    'Saya merasa ketukan tetap stabil saat mendengarkan tempo metronom dan menghitung dalam hati.',
                    'Menahan tuts lebih lama (legato) membutuhkan kesabaran dan kepekaan rasa musikal.',
                    'Bagian nada melompat (interval jauh) memerlukan konsentrasi melihat posisi tuts di layar.',
                    'Bermain bersama tim melatih kami saling mendukung dan tidak saling menyalahkan.',
                  ].map((ans, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReflectionAnswers(prev => ({ ...prev, [1]: ans }))}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex items-center gap-3 ${
                        reflectionAnswers[1] === ans
                          ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                          : 'bg-slate-900/60 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <CheckCircle className={`w-5 h-5 shrink-0 ${
                        reflectionAnswers[1] === ans ? 'text-teal-400' : 'text-slate-600'
                      }`} />
                      <span>{ans}</span>
                    </button>
                  ))}
                </div>

                {reflectionAnswers[1] && (
                  <div className="mt-4 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm animate-fadeIn">
                    👏 <strong>Apresiasi Guru:</strong> Hebat sekali! Pemikiran refleksimu membuktikan kamu telah menguasai pembelajaran mendalam seni musik kelas 5 SD Teramia.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Kurikulum Seni Musik Kelas 5 SD TERAMIA · Pembelajaran Mendalam
          </span>
          <button
            onClick={() => {
              if (isPlayingDemo) onStopDemo();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition-colors shadow-lg"
          >
            Mulai Mainkan di Piano IFP
          </button>
        </div>
      </div>
    </div>
  );
};
