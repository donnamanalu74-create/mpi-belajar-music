import React, { useState } from 'react';
import { MUSIC_THEORY_TOPICS } from '../data/musicData';
import { narrator } from '../utils/narrator';
import { Volume2, BookMarked, Music } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(MUSIC_THEORY_TOPICS[0].id);

  if (!isOpen) return null;

  const currentTopic = MUSIC_THEORY_TOPICS.find(t => t.id === selectedTopicId) || MUSIC_THEORY_TOPICS[0];

  const handleReadSummary = () => {
    narrator.speak(`${currentTopic.title}. ${currentTopic.summary}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-900/60 via-slate-800 to-teal-900/60 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <span className="text-teal-400 font-extrabold text-xs tracking-wider uppercase">
                SD TERAMIA · MATERI SENI MUSIK KELAS 5
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                Paparan Ringkas Teori Piano & Musik
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

        {/* Content Body: Sidebar list + Detail card */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Menu (Topics) */}
          <div className="w-full md:w-72 bg-slate-950/70 p-3 border-r border-slate-800 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
            {MUSIC_THEORY_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                  selectedTopicId === topic.id
                    ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Music className={`w-4 h-4 shrink-0 ${selectedTopicId === topic.id ? 'text-slate-950' : 'text-teal-400'}`} />
                <div className="truncate">
                  <div className="text-xs uppercase tracking-wider opacity-80">{topic.category}</div>
                  <div className="text-sm font-extrabold truncate">{topic.title}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Topic Details */}
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-5 bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">
                  {currentTopic.category}
                </span>
                <h3 className="text-2xl font-black text-white font-display">
                  {currentTopic.title}
                </h3>
              </div>
              <button
                onClick={handleReadSummary}
                className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Bacakan Materi</span>
              </button>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-200 text-base leading-relaxed">
              {currentTopic.summary}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-teal-300 uppercase tracking-wider">
                Poin Kunci Pembelajaran Siswa:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTopic.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-sm text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note notation example box */}
            <div className="p-4 bg-teal-950/30 rounded-2xl border border-teal-500/30">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Contoh Penerapan di Piano IFP:
              </span>
              <div className="mt-1 font-mono text-sm text-teal-200 font-bold">
                {currentTopic.exampleNotes}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Materi Standar Kurikulum Seni Budaya & Musik Kelas 5 SD TERAMIA
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition-colors shadow"
          >
            Tutup Materi
          </button>
        </div>
      </div>
    </div>
  );
};
