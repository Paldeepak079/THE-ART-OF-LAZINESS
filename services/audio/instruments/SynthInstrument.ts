import * as Tone from 'tone';
import { AudioConfig } from '../../../modules/audio/config/audioConfig';

export class SynthInstrument {
  private synth: Tone.PolySynth;
  private isPlaying = false;

  constructor(finger: string, inputNode: Tone.ToneAudioNode) {
    const config = AudioConfig.FINGER_INSTRUMENTS[finger as keyof typeof AudioConfig.FINGER_INSTRUMENTS];
    
    // Use PolySynth for better sound quality
    this.synth = new Tone.PolySynth(Tone.Synth, {
      ...config.options,
      envelope: {
        ...config.options.envelope,
        attack: 0.02,    // Faster attack for sharper sound
        release: 0.15    // Shorter release to reduce overlap
      },
      volume: config.options.volume
    }).connect(inputNode);
  }

  play(note: string): void {
    if (!this.isPlaying) {
      this.synth.triggerAttack(note, undefined, 1); // Full velocity for louder sound
      this.isPlaying = true;
    }
  }

  release(): void {
    if (this.isPlaying) {
      this.synth.triggerRelease();
      this.isPlaying = false;
    }
  }

  dispose(): void {
    this.synth.dispose();
  }
}