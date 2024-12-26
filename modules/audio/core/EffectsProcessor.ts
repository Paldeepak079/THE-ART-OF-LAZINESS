import * as Tone from 'tone';
import { AudioConfig } from '../config/audioConfig';
import { type Position } from '../types';

export class EffectsProcessor {
  private reverb: Tone.Reverb;
  private delay: Tone.FeedbackDelay;
  private filter: Tone.Filter;
  private panner: Tone.Panner;

  constructor() {
    this.reverb = new Tone.Reverb(AudioConfig.EFFECTS.REVERB_TIME);
    this.delay = new Tone.FeedbackDelay(AudioConfig.EFFECTS.DELAY_TIME);
    this.filter = new Tone.Filter(AudioConfig.EFFECTS.FILTER_FREQ);
    this.panner = new Tone.Panner(0);

    // Effects chain
    Tone.Destination.chain(
      this.filter,
      this.delay,
      this.reverb,
      this.panner
    );
  }

  async initialize(): Promise<void> {
    await this.reverb.generate();
  }

  processPosition({ x, y, velocity }: Position): void {
    // Pan based on x position
    this.panner.pan.rampTo(x * 2 - 1, 0.1);

    // Filter frequency based on y position
    const freq = Tone.ftom(y * 10000 + 100);
    this.filter.frequency.rampTo(freq, 0.1);

    // Effects mix based on velocity
    const mix = Math.min(velocity * 0.5, 0.5);
    this.reverb.wet.rampTo(mix, 0.1);
    this.delay.wet.rampTo(mix, 0.1);
  }

  dispose(): void {
    this.reverb.dispose();
    this.delay.dispose();
    this.filter.dispose();
    this.panner.dispose();
  }
}