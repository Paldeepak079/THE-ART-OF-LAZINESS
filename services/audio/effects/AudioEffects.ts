import * as Tone from 'tone';

export class AudioEffects {
  private noiseGate: Tone.Gate;
  private compressor: Tone.Compressor;
  private limiter: Tone.Limiter;
  private eq: Tone.EQ3;
  private filter: Tone.Filter;
  private gain: Tone.Gain;

  constructor() {
    // Additional gain stage for amplification
    this.gain = new Tone.Gain(4); // 4x amplification

    // Enhanced EQ with balanced frequency response
    this.eq = new Tone.EQ3({
      low: 6,       // Moderate bass boost
      mid: 3,       // Slight mid boost for clarity
      high: -3,     // Gentle high cut
      lowFrequency: 200,
      highFrequency: 2000
    });

    // Musical filter
    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 2000,
      rolloff: -24,
      Q: 1
    });

    // Precise noise gate
    this.noiseGate = new Tone.Gate({
      threshold: -60,
      smoothing: 0.98
    });

    // Dynamic compression
    this.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 3,
      attack: 0.02,
      release: 0.2,
      knee: 10
    });

    // Protection limiter
    this.limiter = new Tone.Limiter(-1);

    // Enhanced effects chain with gain
    this.eq.chain(
      this.filter,
      this.gain,
      this.noiseGate,
      this.compressor,
      this.limiter,
      Tone.Destination
    );
  }

  getInputNode(): Tone.EQ3 {
    return this.eq;
  }

  dispose(): void {
    this.noiseGate.dispose();
    this.compressor.dispose();
    this.limiter.dispose();
    this.eq.dispose();
    this.filter.dispose();
    this.gain.dispose();
  }
}