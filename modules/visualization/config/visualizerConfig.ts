export const VisualizerConfig = {
  WAVEFORM: {
    LINE_WIDTH: 2,
    GLOW_INTENSITY: 15,
    SMOOTHING: 0.8
  },
  
  PARTICLES: {
    COUNT: 100,
    BASE_SPEED: 2,
    DECAY_RATE: 0.005,
    GLOW_INTENSITY: 10,
    MIN_SIZE: 1,
    MAX_SIZE: 4
  },
  
  FREQUENCY: {
    BAR_COUNT: 64,
    BAR_SPACING: 2,
    GLOW_INTENSITY: 20,
    MIN_HEIGHT: 5,
    MAX_HEIGHT_FACTOR: 0.7
  },
  
  COLORS: {
    PRIMARY: '#4a90e2',
    SECONDARY: '#50e3c2',
    ACCENT: '#b4ec51',
    BACKGROUND: '#1a1a1a'
  }
} as const;