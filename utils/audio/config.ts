export const SYNTH_CONFIG = {
  oscillator: {
    type: 'sine',
    partials: [1, 0.5, 0.25], // Richer harmonics
  },
  envelope: {
    attack: 0.02,  // Faster attack
    decay: 0.1,
    sustain: 0.3,
    release: 0.5   // Shorter release
  },
  volume: -6,      // Slightly lower volume to prevent distortion
} as const;

export const NOTES = {
  thumb: 'C4',
  index: 'D4',
  middle: 'E4',
  ring: 'F4',
  pinky: 'G4'
} as const;

export const VOLUME_SMOOTHING = 0.15; // Smooth volume changes