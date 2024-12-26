import * as Tone from 'tone';
import { AudioConfig } from '../../../modules/audio/config/audioConfig';

export function createSynth(
  config: typeof AudioConfig.FINGER_INSTRUMENTS[keyof typeof AudioConfig.FINGER_INSTRUMENTS],
  panValue: number,
  outputNode: Tone.ToneAudioNode
): Tone.PolySynth {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'sine',
      volume: config.options.oscillator.volume,
      partials: config.options.oscillator.partials
    },
    envelope: {
      ...config.options.envelope,
      attackCurve: 'exponential',
      releaseCurve: 'exponential'
    }
  });

  // Create and connect panner with valid value
  const panner = new Tone.Panner(Math.max(-1, Math.min(1, panValue))).connect(outputNode);
  synth.connect(panner);

  return synth;
}