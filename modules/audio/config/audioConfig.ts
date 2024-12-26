export const AudioConfig = {
  FINGER_INSTRUMENTS: {
    thumb: {
      type: 'synth',
      options: {
        oscillator: { 
          type: 'sine',
          volume: 15,
          partials: [1, 0.5, 0.3]
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.8,
          release: 0.3
        }
      }
    },
    index: {
      type: 'synth',
      options: {
        oscillator: { 
          type: 'sine',
          volume: 15,
          partials: [1, 0.6, 0.2]
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.8,
          release: 0.3
        }
      }
    },
    middle: {
      type: 'synth',
      options: {
        oscillator: { 
          type: 'sine',
          volume: 15,
          partials: [1, 0.4, 0.3]
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.8,
          release: 0.3
        }
      }
    },
    ring: {
      type: 'synth',
      options: {
        oscillator: { 
          type: 'sine',
          volume: 15,
          partials: [1, 0.3, 0.4]
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.8,
          release: 0.3
        }
      }
    },
    pinky: {
      type: 'synth',
      options: {
        oscillator: { 
          type: 'sine',
          volume: 15,
          partials: [1, 0.5, 0.2]
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.8,
          release: 0.3
        }
      }
    }
  },

  // Harmonically related notes for better blending
  FINGER_NOTES: {
    thumb: 'C4',
    index: 'E4',
    middle: 'G4',
    ring: 'B4',
    pinky: 'D5'
  },

  VOLUME: {
    min: -20,
    max: 15, // Reduced max volume for better control
    default: 0
  }
} as const;