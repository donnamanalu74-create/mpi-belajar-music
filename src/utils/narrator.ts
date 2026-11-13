/**
 * Text-to-Speech (TTS) Narrator in Bahasa Indonesia
 * Guiding Grade 5 students of SD TERAMIA through music learning, challenges, and team matches.
 */

class MusicNarrator {
  private enabled: boolean = true;
  private voice: SpeechSynthesisVoice | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoice();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
    }
  }

  private initVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize Indonesian voice (id-ID or id)
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia'));
    if (idVoice) {
      this.voice = idVoice;
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stop();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.enabled || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95; // Friendly, clear pedagogical pacing for 5th graders
      utterance.pitch = 1.05;

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
}

export const narrator = new MusicNarrator();
