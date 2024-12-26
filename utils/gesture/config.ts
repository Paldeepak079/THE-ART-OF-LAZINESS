export const FINGER_INDICES = {
  thumb: { tip: 4, middle: 3, base: 2 },
  index: { tip: 8, middle: 7, base: 6 },
  middle: { tip: 12, middle: 11, base: 10 },
  ring: { tip: 16, middle: 15, base: 14 },
  pinky: { tip: 20, middle: 19, base: 18 }
} as const;

export const DETECTION_THRESHOLDS = {
  thumb: 0.3,
  index: 0.4,
  middle: 0.4,
  ring: 0.35,
  pinky: 0.3
} as const;

export const GESTURE_THRESHOLDS = {
  RAISED_THRESHOLD: 0.15,
  CLOSED_FINGER_COUNT: 1,
  CONFIDENCE_THRESHOLD: 0.7,
  POSITION_SMOOTHING: 0.3
} as const;