import * as Tone from 'tone';
import { SYNTH_CONFIG } from './config';

class Synthesizer {
  private synth: Tone.PolySynth;
  private activeNotes: Set<string>;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth, SYNTH_CONFIG).toDestination();
    this.activeNotes = new Set();
  }

  async initialize(): Promise<void> {
    await Tone.start();
    // Set initial latency compensation
    Tone.context.lookAhead = 0.01;
    this.synth.sync();
  }

  playNote(note: string): void {
    if (!this.activeNotes.has(note)) {
      this.synth.triggerAttack(note);
      this.activeNotes.add(note);
    }
  }

  releaseNote(note: string): void {
    if (this.activeNotes.has(note)) {
      this.synth.triggerRelease(note);
      this.activeNotes.delete(note);
    }
  }

  setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    const dbVolume = Tone.gainToDb(normalizedVolume);
    this.synth.volume.rampTo(dbVolume, 0.05); // Faster volume transition
  }

  releaseAll(): void {
    this.synth.releaseAll();
    this.activeNotes.clear();
  }
}

export const synthesizer = new Synthesizer();