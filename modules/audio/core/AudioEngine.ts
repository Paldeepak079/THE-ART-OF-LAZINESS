import * as Tone from 'tone';
import { AudioConfig } from '../config/audioConfig';
import { InstrumentManager } from './InstrumentManager';
import { EffectsProcessor } from './EffectsProcessor';
import { type AudioState } from '../types';

export class AudioEngine {
  private instruments: InstrumentManager;
  private effects: EffectsProcessor;
  private isInitialized = false;

  constructor() {
    this.instruments = new InstrumentManager();
    this.effects = new EffectsProcessor();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await Tone.start();
    await this.instruments.initialize();
    await this.effects.initialize();
    
    Tone.Transport.bpm.value = AudioConfig.DEFAULT_BPM;
    this.isInitialized = true;
  }

  processGesture(state: AudioState): void {
    if (!this.isInitialized) return;

    // Process instrument triggers based on finger states
    this.instruments.processFingerStates(state.fingers);

    // Update effects based on hand position and movement
    this.effects.processPosition({
      x: state.position.x,
      y: state.position.y,
      velocity: state.velocity
    });

    // Handle global state changes
    if (state.isClosed) {
      this.instruments.releaseAll();
    }

    // Update master volume
    const volume = state.isRaised ? 1 - state.position.y : 0;
    Tone.Destination.volume.rampTo(Tone.gainToDb(volume), 0.1);
  }

  dispose(): void {
    this.instruments.dispose();
    this.effects.dispose();
    this.isInitialized = false;
  }
}