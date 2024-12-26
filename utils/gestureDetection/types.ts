import { HandGesture } from '../../types';

export interface HandLandmarks {
  x: number;
  y: number;
  z: number;
}

export interface GestureDetectionResult {
  gesture: HandGesture | null;
  error: Error | null;
}

export interface HandPosition {
  isRaised: boolean;
  position: {
    x: number;
    y: number;
  };
}

export interface GestureDetectionOptions {
  retryAttempts?: number;
  retryDelay?: number;
}