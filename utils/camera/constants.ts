export const CAMERA_CONSTRAINTS = {
  video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: false
} as const;