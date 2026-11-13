/**
 * Music Curriculum, Theory, and 10-Bar Challenge Dataset for SD TERAMIA Kelas 5
 */

export interface NoteItem {
  id: string;
  note: string;           // e.g. "C4", "E4"
  duration: '1/4' | '1/2' | '1' | '1/8'; // Quarter (1 beat), Half (2 beats), Whole (4 beats), Eighth (0.5 beat)
  beatPosition: number;   // 1, 2, 3, 4
  durationBeats: number;  // 1, 2, 4, 0.5
  solfege: string;        // "Do", "Re", etc.
  targetDurationMs: number; // expected touch hold time
}

export interface BarComposition {
  barNumber: number;      // 1 to 10
  dynamic: 'p' | 'mf' | 'f'; // Piano, Mezzo-forte, Forte
  articulation: 'normal' | 'staccato' | 'legato';
  label: string;          // brief bar theme
  notes: NoteItem[];
}

export interface MusicChallenge {
  id: string;
  levelId: number;
  challengeNumber: number; // 1 to 10
  title: string;
  subtitle: string;
  timeSignature: '4/4' | '3/4';
  bpm: number;
  learningFocus: string;
  analysisGuide: string;
  reflectionQuestion: string;
  bars: BarComposition[]; // Exactly 10 bars
}

export interface MusicLevel {
  id: number;
  title: string;
  theme: string;
  badge: string;
  description: string;
  challenges: MusicChallenge[]; // Exactly 10 challenges per level!
}

// Helper to generate a 10-bar composition cleanly
function create10BarChallenge(
  levelId: number,
  challengeNum: number,
  title: string,
  subtitle: string,
  learningFocus: string,
  analysisGuide: string,
  reflectionQuestion: string,
  bpm: number,
  melodyNotesByBar: {
    dynamic: 'p' | 'mf' | 'f';
    articulation: 'normal' | 'staccato' | 'legato';
    notes: { note: string; dur: '1/4' | '1/2' | '1' | '1/8'; solfege: string }[];
  }[]
): MusicChallenge {
  const bars: BarComposition[] = melodyNotesByBar.map((barData, barIdx) => {
    let currentBeat = 1;
    const notes: NoteItem[] = barData.notes.map((n, noteIdx) => {
      const beats = n.dur === '1' ? 4 : n.dur === '1/2' ? 2 : n.dur === '1/8' ? 0.5 : 1;
      const beatPos = currentBeat;
      currentBeat += beats;

      // Base touch duration target based on articulation and note value
      let targetMs = (60000 / bpm) * beats * 0.8;
      if (barData.articulation === 'staccato') {
        targetMs = Math.min(220, targetMs * 0.35);
      } else if (barData.articulation === 'legato') {
        targetMs = targetMs * 1.05;
      }

      return {
        id: `l${levelId}-c${challengeNum}-b${barIdx + 1}-n${noteIdx}`,
        note: n.note,
        duration: n.dur,
        beatPosition: beatPos,
        durationBeats: beats,
        solfege: n.solfege,
        targetDurationMs: Math.round(targetMs),
      };
    });

    return {
      barNumber: barIdx + 1,
      dynamic: barData.dynamic,
      articulation: barData.articulation,
      label: `Birama ${barIdx + 1}`,
      notes,
    };
  });

  return {
    id: `level-${levelId}-challenge-${challengeNum}`,
    levelId,
    challengeNumber: challengeNum,
    title,
    subtitle,
    timeSignature: '4/4',
    bpm,
    learningFocus,
    analysisGuide,
    reflectionQuestion,
    bars,
  };
}

// ==========================================
// LEVEL 1: Langkah Pertama Harmoni SD Teramia
// ==========================================
const level1Challenges: MusicChallenge[] = [
  // Tantangan 1
  create10BarChallenge(
    1, 1,
    'Tantangan 1: Melangkah Diatonis Ceria',
    'Pengenalan nada Do, Re, Mi, Fa, Sol secara teratur dengan ketukan seperempat.',
    'Mengenal tuts putih C4 hingga G4 dan membaca not seperempat pada garis birama 4/4.',
    'Amati arah pergerakan melodi pada partitur: apakah nadanya melangkah naik atau turun?',
    'Bagaimana caramu menjaga ketukan stabil 1 detik per nada tanpa terburu-buru?',
    80,
    [
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/2', solfege: 'Sol' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/4', solfege: 'Do' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/2', solfege: 'Re' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'p', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  // Tantangan 2
  create10BarChallenge(
    1, 2,
    'Tantangan 2: Lompatan Nada Tiga Serangkai',
    'Melatih lompatan interval terts (Do-Mi, Re-Fa, Mi-Sol).',
    'Menganalisis interval terts (jarak dua nada) pada tuts piano dan garis paranada.',
    'Perhatikan posisi not di paranada: Mengapa not terts melompati satu spasi atau satu garis?',
    'Apa perbedaan yang kamu dengar antara nada melangkah dan nada melompat?',
    80,
    [
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'p', articulation: 'normal', notes: [{ note: 'D4', dur: '1/2', solfege: 'Re' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  // Tantangan 3
  create10BarChallenge(
    1, 3,
    'Tantangan 3: Gema Bel Sekolah Teramia',
    'Variasi nada panjang setengah (2 ketuk) dan penuh (4 ketuk) berulang.',
    'Membedakan durasi sentuh not setengah dan not penuh dengan ketukan metronom.',
    'Amati bentuk bulatan not: apa perbedaan not yang bertangkai kosong dengan not hitam penuh?',
    'Mengapa menahan tuts sesuai durasi sangat penting dalam membentuk harmoni lagu?',
    75,
    [
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'D4', dur: '1/2', solfege: 'Re' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'F4', dur: '1/2', solfege: 'Fa' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'A4', dur: '1/2', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  // Tantangan 4
  create10BarChallenge(
    1, 4,
    'Tantangan 4: Senam Jari Ceria',
    'Latihan pergantian pola jari pada 5 nada utama dengan ritme seimbang.',
    'Melatih kelenturan jari menekan tuts tanpa mengangkat telapak tangan terlalu tinggi.',
    'Analisis pola birama 1-2 dan bandingkan dengan birama 5-6: Adakah kesamaan motif?',
    'Bagaimana kerja sama tim membantu menyamakan ritme ketukan?',
    85,
    [
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'p', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  // Tantangan 5
  create10BarChallenge(
    1, 5,
    'Tantangan 5: Panggilan Sang Surya',
    'Komposisi bertahap dari lembut (piano p) menuju puncak semangat (forte f).',
    'Menganalisis tanda dinamika bertingkat (crescendo) dari p -> mf -> f.',
    'Perhatikan tanda dinamika di setiap birama: di birama berapakah puncak kekuatannya?',
    'Sentuhan seperti apa yang kamu gunakan agar nada terdengar lembut seperti bisikan?',
    80,
    [
      { dynamic: 'p', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'p', articulation: 'normal', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'A4', dur: '1/2', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C5', dur: '1', solfege: "Do'" }] },
    ]
  ),
  // Tantangan 6
  create10BarChallenge(
    1, 6,
    'Tantangan 6: Percakapan Dua Sahabat',
    'Dialog tanya jawab antar dua frasa nada (frasa tanya dan frasa jawab).',
    'Menganalisis struktur kalimat tanya (berhenti di Sol/Re) dan kalimat jawab (tuntas di Do).',
    'Mengapa nada penutup di birama 4 terasa masih menggantung sedangkan birama 10 terasa tuntas?',
    'Bagaimana dinamika p dan f membantu menggambarkan suasana percakapan dua orang?',
    80,
    [
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'p', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'A4', dur: '1/2', solfege: 'La' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'C5', dur: '1/4', solfege: "Do'" }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/2', solfege: 'Fa' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  // Tantangan 7
  create10BarChallenge(
    1, 7,
    'Tantangan 7: Gerimis di Atas Daun',
    'Latihan ketukan staccato (ringan dan memantul) di birama awal lalu legato mengalir.',
    'Membandingkan simbol titik staccato di atas not dengan garis legato busur.',
    'Perhatikan sensasi sentuhan jarimu: seberapa cepat kamu melepas tuts saat staccato?',
    'Mengapa perubahan artikulasi staccato ke legato dapat mengubah suasana lagu?',
    85,
    [
      { dynamic: 'mf', articulation: 'staccato', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'staccato', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'staccato', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'staccato', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'C4', dur: '1/2', solfege: 'Do' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'G4', dur: '1/2', solfege: 'Sol' }, { note: 'C5', dur: '1/2', solfege: "Do'" }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  // Tantangan 8
  create10BarChallenge(
    1, 8,
    'Tantangan 8: Kereta Cepat Merah Putih',
    'Tempo semakin bersemangat dengan melodi berulang yang energetik.',
    'Menganalisis pergerakan nada cepat dan pengulangan birama (repetisi musik).',
    'Cari tahu birama mana yang memiliki not tertinggi dalam partitur 10 bar ini!',
    'Apa tantangan terberat saat memainkan nada di tempo yang lebih lincah?',
    90,
    [
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'C5', dur: '1/4', solfege: "Do'" }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'A4', dur: '1/4', solfege: 'La' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/2', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'C5', dur: '1/2', solfege: "Do'" }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D5', dur: '1/4', solfege: "Re'" }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/4', solfege: 'La' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'B4', dur: '1/2', solfege: 'Si' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C5', dur: '1', solfege: "Do'" }] },
    ]
  ),
  // Tantangan 9
  create10BarChallenge(
    1, 9,
    'Tantangan 9: Senandung Senja Danau',
    'Nuansa melankolis lembut dengan dinamika piano (p) dan legato mendayu.',
    'Menganalisis penggunaan nada La (A4) yang memberi warna ekspresi lagu tenang.',
    'Bagaimana perbedaan rasa antara lagu riang mayor dengan melodi yang sering mampir ke nada La?',
    'Apakah timmu berhasil menjaga kelembutan tanpa mematikan suara piano?',
    75,
    [
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'A4', dur: '1/2', solfege: 'La' }, { note: 'C5', dur: '1/2', solfege: "Do'" }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'B4', dur: '1/2', solfege: 'Si' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'D4', dur: '1', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'A4', dur: '1/2', solfege: 'La' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'G4', dur: '1/2', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/4', solfege: 'Do' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'D4', dur: '1/2', solfege: 'Re' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'D4', dur: '1/2', solfege: 'Re' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  // Tantangan 10
  create10BarChallenge(
    1, 10,
    'Tantangan 10: Mars Prestasi Siswa Teramia',
    'Komposisi akbar penutup Level 1 mengombinasikan tangga nada penuh dan dinamika dinamis.',
    'Menganalisis seluruh tangga nada C Major dari C4 hingga C5 dengan artikulasi lengkap.',
    'Periksa partitur dari bar 1 hingga 10: sebutkan birama mana yang memiliki dinamika Forte terkuat!',
    'Pelajaran apa yang paling berharga setelah menuntaskan 10 tantangan di Level 1?',
    85,
    [
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'B4', dur: '1/2', solfege: 'Si' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C5', dur: '1/2', solfege: "Do'" }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C5', dur: '1', solfege: "Do'" }] },
    ]
  ),
];

// ==========================================
// LEVEL 2: Melodi Nusantara Ceria Anak SD
// ==========================================
const level2Challenges: MusicChallenge[] = [
  // 10 Tantangan Lagu Nusantara Adaptasi 10 Bar untuk Kelas 5 SD
  create10BarChallenge(
    2, 1,
    'Tantangan 1: Ibu Kita Kartini (Frasa Pembuka)',
    'Menghayati lagu nasional dengan ketukan mantap dan penghormatan mulia.',
    'Menganalisis notasi balok lagu nasional Ibu Kita Kartini ciptaan W.R. Soepratman.',
    'Amati birama 3 dan 4: bagaimana nada melompat dari Re ke Fa lalu ke Sol?',
    'Nilai karakter apa yang kamu rasakan saat menyanyikan dan memainkan lagu ini?',
    75,
    [
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/2', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/2', solfege: 'Do' }, { note: 'A4', dur: '1/2', solfege: 'La' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'F4', dur: '1/2', solfege: 'Fa' }, { note: 'A4', dur: '1/2', solfege: 'La' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C5', dur: '1', solfege: "Do'" }] },
    ]
  ),
  create10BarChallenge(
    2, 2,
    'Tantangan 2: Suwe Ora Jamu (Jawa Tengah)',
    'Melodi riang lagu daerah dengan aksen staccato jenaka.',
    'Menganalisis tangga nada pentatonis yang diadaptasi ke tuts diatonis piano.',
    'Mengapa birama 1 dan 2 terasa sangat berirama dan mudah diingat?',
    'Bagaimana timmu mengatur kekompakan agar sentuhan staccato terdengar serentak?',
    85,
    [
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'D4', dur: '1/2', solfege: 'Re' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 3,
    'Tantangan 3: Gundhul Pacul (Lompatan Gembira)',
    'Irama energik melatih lompatan terts dan ritme ketukan ganjil-genap.',
    'Menganalisis notasi lompatan Do-Mi-Do-Mi-Fa-Sol-Sol.',
    'Perhatikan bar 1: Not apa saja yang membentuk melodi khas Gundhul Pacul?',
    'Sentuhan mana yang membuat melodi ini terasa lucu dan gembira?',
    90,
    [
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'C5', dur: '1/4', solfege: "Do'" }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'C5', dur: '1/4', solfege: "Do'" }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'B4', dur: '1/2', solfege: 'Si' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 4,
    'Tantangan 4: Ampar-Ampar Pisang (Kalimantan Selatan)',
    'Ritme sinkopasi lincah dan pengulangan nada Mi dan Sol.',
    'Menganalisis ketukan rapat pada not seperdelapan dan seperempat.',
    'Amati birama 1 dan 2: ada berapa kali nada Sol diulang?',
    'Bagaimana menjaga jari tetap rileks saat memainkan ketukan cepat?',
    88,
    [
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 5,
    'Tantangan 5: Burung Kakaktua (Maluku)',
    'Melodi riang 3/4 gaya waltz diadaptasi ke 10 bar dinamis.',
    'Menganalisis pergerakan harmoni mayor ceria pada lagu anak Indonesia.',
    'Bandingkan tinggi nada di bar 1 (Do-Mi-Sol) dan bar 5 (Do tinggi): seberapa jauh rentangnya?',
    'Apa yang membuat melodi ini sangat mudah dinyanyikan bersama di kelas?',
    80,
    [
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'p', articulation: 'normal', notes: [{ note: 'G4', dur: '1', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/2', solfege: 'La' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 6,
    'Tantangan 6: Bungong Jeumpa (Aceh)',
    'Melodi anggun dan khidmat penuh keindahan bunga cempaka.',
    'Menganalisis melodi legato yang anggun dengan tangga nada pentatonik Aceh.',
    'Perhatikan bar 3-4: Bagaimana perpindahan lembut dari Sol ke Fa dan Mi?',
    'Bagaimana rasa penghormatan tercermin melalui sentuhan piano yang halus?',
    75,
    [
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'A4', dur: '1/2', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'C5', dur: '1/2', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/4', solfege: 'La' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'G4', dur: '1/2', solfege: 'Sol' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'E4', dur: '1', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'D4', dur: '1/2', solfege: 'Re' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 7,
    'Tantangan 7: Rasa Sayange (Maluku)',
    'Irama pantun bersahut riang gembira penuh kekeluargaan.',
    'Menganalisis pengulangan frasa nada Fa-Sol-La yang ceria.',
    'Identifikasi nada tertinggi dalam komposisi ini: berada di birama berapa?',
    'Mengapa bermain piano bersama tim membuat suasana belajar menjadi lebih menyenangkan?',
    86,
    [
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/2', solfege: 'Fa' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/2', solfege: 'Fa' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 8,
    'Tantangan 8: Tokecang (Jawa Barat)',
    'Ketukan cepat staccato khas kesenian Sunda yang jenaka.',
    'Menganalisis aksen kuat pada ketukan pertama tiap birama.',
    'Amati birama 1 dan 2: bagaimana perbedaan ritme antara kata To-ke-cang dan kancil?',
    'Sentuhan mana yang paling efektif menirukan bunyi kendang Sunda?',
    92,
    [
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'staccato', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'A4', dur: '1/4', solfege: 'La' }] },
      { dynamic: 'mf', articulation: 'staccato', notes: [{ note: 'G4', dur: '1/2', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/4', solfege: 'La' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 9,
    'Tantangan 9: Yamko Rambe Yamko (Papua)',
    'Irama kepahlawanan perkasa dengan melodi naik bergelora.',
    'Menganalisis progresi akor tonika ke subdominan pada lagu daerah Papua.',
    'Perhatikan perubahan dinamika di bar 5 saat melodi melesat ke nada Do tinggi!',
    'Bagaimana semangat persatuan tercermin dalam musik daerah dari ujung timur nusantara?',
    88,
    [
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/2', solfege: 'Fa' }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'C4', dur: '1/2', solfege: 'Do' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C4', dur: '1', solfege: 'Do' }] },
    ]
  ),
  create10BarChallenge(
    2, 10,
    'Tantangan 10: Medley Nusantara Raya SD Teramia',
    'Komposisi mahakarya 10 bar merangkum kekayaan irama seluruh Indonesia.',
    'Menganalisis penggabungan ragam motif daerah dalam satu kesatuan birama harmonis.',
    'Amati 10 birama: birama mana yang menurutmu memiliki peralihan melodi paling menantang?',
    'Bagaimana pemahaman seni musik membantumu lebih mencintai kebudayaan Indonesia?',
    84,
    [
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C4', dur: '1/4', solfege: 'Do' }, { note: 'D4', dur: '1/4', solfege: 'Re' }, { note: 'E4', dur: '1/4', solfege: 'Mi' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'staccato', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'E4', dur: '1/2', solfege: 'Mi' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'F4', dur: '1/4', solfege: 'Fa' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'F4', dur: '1/4', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'legato', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'D4', dur: '1/2', solfege: 'Re' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'B4', dur: '1/4', solfege: 'Si' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'G4', dur: '1/4', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'C5', dur: '1/4', solfege: "Do'" }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'p', articulation: 'legato', notes: [{ note: 'E4', dur: '1/2', solfege: 'Mi' }, { note: 'F4', dur: '1/2', solfege: 'Fa' }] },
      { dynamic: 'mf', articulation: 'normal', notes: [{ note: 'G4', dur: '1/4', solfege: 'Sol' }, { note: 'A4', dur: '1/4', solfege: 'La' }, { note: 'B4', dur: '1/2', solfege: 'Si' }] },
      { dynamic: 'f', articulation: 'normal', notes: [{ note: 'C5', dur: '1/2', solfege: "Do'" }, { note: 'G4', dur: '1/2', solfege: 'Sol' }] },
      { dynamic: 'f', articulation: 'legato', notes: [{ note: 'C5', dur: '1', solfege: "Do'" }] },
    ]
  ),
];

// All levels
export const MUSIC_LEVELS: MusicLevel[] = [
  {
    id: 1,
    title: 'Level 1: Dasar Diatonis & Tangga Nada',
    theme: 'Pondasi Tangga Nada C Major, Nilai Ketukan & Pengenalan Tuts',
    badge: 'Pemula Cerdas',
    description: '10 Tantangan musik 10-bar yang melatih kepekaan membaca notasi balok dan tangga nada diatonis dasar.',
    challenges: level1Challenges,
  },
  {
    id: 2,
    title: 'Level 2: Ragam Melodi Ceria Nusantara',
    theme: 'Irama Lagu Daerah & Nasional dengan Ragam Dinamika',
    badge: 'Pewaris Budaya',
    description: '10 Tantangan musik 10-bar aransemen lagu daerah nusantara melatih artikulasi staccato dan legato.',
    challenges: level2Challenges,
  },
];

// Concise Music Theory Modules for Grade 5 SD
export interface MusicTheoryTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  keyPoints: string[];
  visualIcon: string;
  exampleNotes: string;
}

export const MUSIC_THEORY_TOPICS: MusicTheoryTopic[] = [
  {
    id: 'tuts-solmisasi',
    title: 'Tuts Piano & Solmisasi (Do-Re-Mi)',
    category: 'Dasar Instrumen',
    summary: 'Piano diatonis memiliki 7 nada pokok putih (C, D, E, F, G, A, B) yang berulang di setiap oktaf serta tuts hitam untuk nada kromatis.',
    keyPoints: [
      'C4 adalah Middle C (Do tengah) patokan utama jari tangan.',
      'Tuts putih melambangkan nada natural (Do, Re, Mi, Fa, Sol, La, Si).',
      'Tuts hitam berada di antara tuts putih untuk nada kres (#) atau mol (b).',
      'Sentuhan lembut menghasilkan suara tenang, sentuhan tegas menghasilkan dinamika kuat.',
    ],
    visualIcon: 'piano',
    exampleNotes: 'C4 = Do · D4 = Re · E4 = Mi · F4 = Fa · G4 = Sol · A4 = La · B4 = Si · C5 = Do tinggi',
  },
  {
    id: 'garis-paranada',
    title: 'Garis Paranada & Kunci G (Treble Clef)',
    category: 'Membaca Notasi',
    summary: 'Notasi balok ditulis pada 5 garis mendatar dan 4 spasi yang dihitung dari garis paling bawah (garis ke-1) hingga garis teratas (garis ke-5).',
    keyPoints: [
      'Garis Paranada terdiri dari 5 garis sejajar dan 4 spasi.',
      'Kunci G (Treble Clef) melingkari garis ke-2, menandakan letak nada G4 (Sol).',
      'Nada C4 (Do) berada di garis bantu bawah (ledger line).',
      'Semakin tinggi posisi bulatan not pada garis atau spasi, semakin tinggi nada bunyinya.',
    ],
    visualIcon: 'staff',
    exampleNotes: 'Garis 1 = E (Mi) · Garis 2 = G (Sol) · Garis 3 = B (Si) · Spasi 1 = F (Fa) · Spasi 2 = A (La)',
  },
  {
    id: 'nilai-ketukan',
    title: 'Nilai Ketukan & Durasi Not Balok',
    category: 'Irama & Ketukan',
    summary: 'Bentuk not balok menentukan berapa lama tuts harus ditahan atau dibunyikan sesuai ketukan metronom.',
    keyPoints: [
      'Not Penuh (Whole Note / ○): Berdurasi 4 ketuk penuh.',
      'Not Setengah (Half Note / 𝅗𝅥): Berdurasi 2 ketuk.',
      'Not Seperempat (Quarter Note / ♩): Berdurasi 1 ketuk mantap.',
      'Not Seperdelapan (Eighth Note / ♪): Berdurasi 1/2 ketuk lincah.',
    ],
    visualIcon: 'notes',
    exampleNotes: 'Birama 4/4 artinya setiap 1 birama berisi total 4 ketukan bernilai not seperempat.',
  },
  {
    id: 'dinamika-artikulasi',
    title: 'Dinamika Musik & Respon Sentuh',
    category: 'Ekspresi Mendalam',
    summary: 'Dinamika adalah keras-lembutnya bunyi musik yang memberikan emosi dan keindahan pada lagu.',
    keyPoints: [
      'Piano (p): Bunyi lembut seperti berbisik (sentuh ringan dan rileks).',
      'Mezzo-Forte (mf): Bunyi sedang, nyaman didengar saat bernyanyi biasa.',
      'Forte (f): Bunyi kuat, tegas dan bersemangat membangkitkan suasana.',
      'Staccato (titik di atas not): Dimainkan pendek-pendek memantul (<250ms).',
      'Legato (garis lengkung): Dimainkan menyambung halus tanpa jeda (>400ms).',
    ],
    visualIcon: 'dynamics',
    exampleNotes: 'Di aplikasi ini, lama jarimu menyentuh tuts piano IFP menentukan penilaian dinamika staccato & legato!',
  },
];
