import * as Tone from 'tone';
import { AudioError } from '../../utils/errors';
import { AudioConfig } from '../../modules/audio/config/audioConfig';
import { createAudioChain } from './chains/audioChain';
import { createSynth } from './synths/synthFactory';

export class AudioService {
  private static instance: AudioService;
  private synths: Map<string, Tone.PolySynth>;
  private activeNotes: Set<string>;
  private isInitialized = false;
  private audioChain: ReturnType<typeof createAudioChain>;

  private constructor() {
    this.synths = new Map();
    this.activeNotes = new Set();
    this.audioChain = createAudioChain();
    this.setupSynths();
  }

  private setupSynths() {
    const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
    fingers.forEach((finger, index) => {
      const config = AudioConfig.FINGER_INSTRUMENTS[finger as keyof typeof AudioConfig.FINGER_INSTRUMENTS];
      const panValue = (index - 2) * 0.2; // Convert to number between -0.4 and 0.4
      const synth = createSynth(config, panValue, this.audioChain.masterVolume);
      this.synths.set(finger, synth);
    });
  }

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      Tone.context.lookAhead = 0;
      await this.audioChain.initialize();
      this.isInitialized = true;
      this.setVolume(0.8);
    } catch (error) {
      throw new AudioError('Failed to initialize audio system');
    }
  }

  setVolume(normalizedVolume: number): void {
    const volume = AudioConfig.VOLUME.min + 
      (AudioConfig.VOLUME.max - AudioConfig.VOLUME.min) * normalizedVolume;
    this.audioChain.setVolume(volume);
  }

  playFingerNote(finger: string): void {
    if (!this.isInitialized) return;

    const synth = this.synths.get(finger);
    const note = AudioConfig.FINGER_NOTES[finger as keyof typeof AudioConfig.FINGER_NOTES];

    if (!synth || !note || this.activeNotes.has(note)) return;

    try {
      const detune = Math.random() * 4 - 2;
      synth.triggerAttack(note, undefined, 0.8 + Math.random() * 0.2);
      synth.set({ detune });
      this.activeNotes.add(note);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  releaseFingerNote(finger: string): void {
    if (!this.isInitialized) return;

    const synth = this.synths.get(finger);
    const note = AudioConfig.FINGER_NOTES[finger as keyof typeof AudioConfig.FINGER_NOTES];

    if (!synth || !note) return;

    try {
      synth.triggerRelease(note);
      this.activeNotes.delete(note);
    } catch (error) {
      console.error('Error releasing note:', error);
    }
  }

  stopAll(): void {
    if (!this.isInitialized) return;
    
    this.synths.forEach(synth => {
      try {
        synth.releaseAll();
      } catch (error) {
        console.error('Error stopping synth:', error);
      }
    });
    this.activeNotes.clear();
  }

  dispose(): void {
    this.stopAll();
    this.synths.forEach(synth => synth.dispose());
    this.audioChain.dispose();
    this.isInitialized = false;
  }
}

export const audioService = AudioService.getInstance();