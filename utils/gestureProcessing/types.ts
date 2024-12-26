export interface HandLandmarks {
  x: number;
  y: number;
  z: number;
}

export interface HandLandmarkerResult {
  landmarks: HandLandmarks[][];
}

export interface HandDetectorOptions {
  maxHands?: number;
  runningMode?: 'VIDEO' | 'IMAGE';
  delegate?: 'GPU' | 'CPU';
}