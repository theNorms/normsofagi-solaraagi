
// Speech synthesis utility for voice responses
class SpeechManager {
  private speechSynthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.setupVoice();
  }

  private setupVoice() {
    // Wait for voices to be loaded
    if (this.speechSynthesis.getVoices().length === 0) {
      this.speechSynthesis.addEventListener('voiceschanged', () => {
        this.selectVoice();
      });
    } else {
      this.selectVoice();
    }
  }

  private selectVoice() {
    const voices = this.speechSynthesis.getVoices();
    
    // Try to find a female English voice for Solara
    this.voice = voices.find(voice => 
      voice.name.includes('Female') && 
      voice.lang.includes('en')
    ) || voices.find(voice => 
      voice.lang.includes('en')
    ) || voices[0];

    console.log('Selected voice:', this.voice?.name);
  }

  public speak(text: string): void {
    this.stop();

    if (!text) return;

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Set up event listeners
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (this.onStartCallback) this.onStartCallback();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    // Store the utterance and start speaking
    this.utterance = utterance;
    this.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (this.isSpeaking || this.isPaused) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }

  public pause(): void {
    if (this.isSpeaking && !this.isPaused) {
      this.speechSynthesis.pause();
      this.isPaused = true;
      this.isSpeaking = false;
    }
  }

  public resume(): void {
    if (this.isPaused) {
      this.speechSynthesis.resume();
      this.isPaused = false;
      this.isSpeaking = true;
    }
  }

  public togglePause(): void {
    if (this.isPaused) {
      this.resume();
    } else if (this.isSpeaking) {
      this.pause();
    }
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  public isCurrentlyPaused(): boolean {
    return this.isPaused;
  }

  public onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }
}

// Create a singleton instance
export const speechManager = new SpeechManager();
