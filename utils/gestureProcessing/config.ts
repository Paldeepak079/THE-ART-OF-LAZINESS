export const MEDIAPIPE_CONFIG = {
  VISION_URL: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
  MODEL_URL: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  OPTIONS: {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate: 'GPU'
    },
    numHands: 1,
    runningMode: 'IMAGE',
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5
  }
} as const;