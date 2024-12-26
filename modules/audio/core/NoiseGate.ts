import * as Tone from 'tone';
import { AudioConfig } from '../config/audioConfig';

export class NoiseGate {
  private gate: Tone.Gate;
  
  constructor() {
    this.gate = new Tone.Gate({
      threshold: AudioConfig.NOISE_GATE.threshold,
      smoothing: AudioConfig.NOISE_GATE.smoothing
    }).toDestination();
  }

  connect(node: Tone.ToneAudioNode): void {
    node.connect(this.gate);
  }

  dispose(): void {
    this.gate.dispose();
  }
}