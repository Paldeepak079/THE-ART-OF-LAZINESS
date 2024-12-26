import * as Tone from 'tone';
import { NOTES, DEFAULT_VOLUME, NOTE_DURATION } from './constants';

class AudioEngine {
  private synth: Tone.PolySynth;
  private isInitialized: boolean;
  private isPlaying: boolean;
  private volume: number;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();

    this.isInitialized = false;
    this.isPlaying = false;
    this.volume = DEFAULT_VOLUME;

    this.setVolume(DEFAULT_VOLUME);
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      this.isInitialized = true;
      console.log('Audio engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    this.isPlaying = true;
    await Tone.Transport.start();
    console.log('Audio engine started');
  }

  stop() {
    this.isPlaying = false;
    this.synth.releaseAll();
    Tone.Transport.stop();
    console.log('Audio engine stopped');
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    const dbVolume = Tone.gainToDb(this.volume);
    this.synth.volume.rampTo(dbVolume, 0.1);
  }

  playNote(note: string) {
    if (!this.isPlaying) return;
    
    try {
      this.synth.triggerAttackRelease(note, NOTE_DURATION);
      console.log(`Playing note: ${note}`);
    } catch (error) {
      console.error(`Failed to play note ${note}:`, error);
    }
  }

  getState() {
    return {
      isInitialized: this.isInitialized,
      isPlaying: this.isPlaying,
      volume: this.volume
    };
  }
}

export const audioEngine = new AudioEngine();