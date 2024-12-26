import * as Tone from 'tone';

export function createAudioChain() {
  const masterReverb = new Tone.Reverb({
    decay: 1.5,
    wet: 0.2
  }).toDestination();

  const masterCompressor = new Tone.Compressor({
    threshold: -15,
    ratio: 3,
    attack: 0.02,
    release: 0.1
  }).connect(masterReverb);

  const masterVolume = new Tone.Volume(0).connect(masterCompressor);

  return {
    masterVolume,
    masterCompressor,
    masterReverb,
    
    async initialize() {
      await masterReverb.generate();
    },

    setVolume(value: number) {
      masterVolume.volume.rampTo(value, 0.1);
    },

    dispose() {
      masterVolume.dispose();
      masterCompressor.dispose();
      masterReverb.dispose();
    }
  };
}