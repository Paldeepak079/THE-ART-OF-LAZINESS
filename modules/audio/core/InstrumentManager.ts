import * as Tone from 'tone';
import { AudioConfig } from '../config/audioConfig';
import { NoiseGate } from './NoiseGate';
import { VolumeController } from './VolumeController';
import { type FingerStates } from '../types';

export class InstrumentManager {
  private instruments: Map<string, Tone.Synth>;
  private activeNotes: Set<string>;
  private noiseGate: NoiseGate;
  private volumeController: VolumeController;

  constructor() {
    this.instruments = new Map();
    this.activeNotes = new Set();
    this.noiseGate = new NoiseGate();
    this.volumeController = new VolumeController();
    this.setupInstruments();
  }

  private setupInstruments(): void {
    Object.entries(AudioConfig.FINGER_INSTRUMENTS).forEach(([finger, config]) => {
      const synth = new Tone.Synth(config.options);
      
      // Connect through noise gate and volume control
      synth.connect(this.volumeController.getNode());
      this.noiseGate.connect(synth);
      
      this.instruments.set(finger, synth);
    });
  }

  processFingerStates(fingerStates: FingerStates): void {
    Object.entries(fingerStates).forEach(([finger, isExtended]) => {
      const instrument = this.instruments.get(finger);
      const note = AudioConfig.FINGER_NOTES[finger];
      
      if (!instrument || !note) return;

      if (isExtended && !this.activeNotes.has(note)) {
        instrument.triggerAttack(note);
        this.activeNotes.add(note);
      } else if (!isExtended && this.activeNotes.has(note)) {
        instrument.triggerRelease();
        this.activeNotes.delete(note);
      }
    });
  }

  updateVolume(handPosition: number): void {
    this.volumeController.updateVolume(handPosition);
  }

  releaseAll(): void {
    this.instruments.forEach(instrument => instrument.triggerRelease());
    this.activeNotes.clear();
  }

  dispose(): void {
    this.instruments.forEach(instrument => instrument.dispose());
    this.noiseGate.dispose();
    this.volumeController.dispose();
    this.instruments.clear();
    this.activeNotes.clear();
  }
}