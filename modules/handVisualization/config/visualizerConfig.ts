export const VisualizerConfig = {
  SMOOTHING_FACTOR: 0.3,

  PARTICLES: {
    EMIT_RATE: 2,
    MIN_SIZE: 2,
    MAX_SIZE: 6,
    MAX_SPEED: 3,
    DECAY_RATE: 0.02
  },

  TRAILS: {
    MAX_POINTS: 30,
    POINT_SPACING: 2,
    LINE_WIDTH: 3
  },

  JOINTS: {
    JOINT_RADIUS: 4,
    FINGERTIP_RADIUS: 6,
    CONNECTION_WIDTH: 2,
    CONNECTION_COLOR: 'rgba(255, 255, 255, 0.5)',
    INNER_COLOR: 'rgba(255, 255, 255, 0.8)',
    OUTER_COLOR: 'rgba(255, 255, 255, 0)'
  },

  // Standard MediaPipe hand connections
  HAND_CONNECTIONS: [
    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // Index
    [5, 9], [9, 10], [10, 11], [11, 12], // Middle
    [9, 13], [13, 14], [14, 15], [15, 16], // Ring
    [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
    [0, 17], [5, 9], [9, 13], [13, 17] // Palm
  ]
} as const;