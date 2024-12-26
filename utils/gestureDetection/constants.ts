export const MEDIAPIPE_CDN_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
export const HAND_LANDMARKER_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // ms

export const LANDMARK_INDICES = {
  WRIST: 0,
  PALM_BASE_LEFT: 5,
  PALM_BASE_RIGHT: 17,
  THUMB_TIP: 4,
  THUMB_BASE: 3,
  INDEX_TIP: 8,
  INDEX_BASE: 7,
  MIDDLE_TIP: 12,
  MIDDLE_BASE: 11,
  RING_TIP: 16,
  RING_BASE: 15,
  PINKY_TIP: 20,
  PINKY_BASE: 19
} as const;