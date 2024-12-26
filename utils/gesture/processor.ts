import { HandGesture, GestureState } from '../../types';
import { calculateFingerStates } from './fingerDetection';
import { smoothPosition } from './positionSmoothing';
import { GESTURE_THRESHOLDS } from './config';

export class GestureProcessor {
  private lastPosition: { x: number, y: number } | null = null;
  private gestureState: GestureState = {
    isRaised: false,
    isClosed: false,
    confidence: 0
  };

  processLandmarks(landmarks: any[]): HandGesture | null {
    if (!landmarks || landmarks.length === 0) return null;

    // Calculate basic hand position
    const position = this.calculateHandPosition(landmarks);
    
    // Apply position smoothing
    const smoothedPosition = this.lastPosition 
      ? smoothPosition(position, this.lastPosition)
      : position;
    
    this.lastPosition = smoothedPosition;

    // Process finger states with improved accuracy
    const fingers = calculateFingerStates(landmarks);
    
    // Update gesture state
    this.updateGestureState(landmarks, fingers);

    return {
      isRaised: this.gestureState.isRaised,
      isClosed: this.gestureState.isClosed,
      position: smoothedPosition,
      fingers,
      confidence: this.gestureState.confidence
    };
  }

  private calculateHandPosition(landmarks: any[]) {
    const wrist = landmarks[0];
    return {
      x: wrist.x,
      y: wrist.y
    };
  }

  private updateGestureState(landmarks: any[], fingers: Record<string, boolean>) {
    const wristY = landmarks[0].y;
    const palmY = (landmarks[5].y + landmarks[17].y) / 2;
    
    // Update raised state with hysteresis
    if (Math.abs(wristY - palmY) > GESTURE_THRESHOLDS.RAISED_THRESHOLD) {
      this.gestureState.isRaised = wristY < palmY;
    }

    // Update closed state with confidence
    const extendedFingers = Object.values(fingers).filter(f => f).length;
    this.gestureState.isClosed = extendedFingers <= GESTURE_THRESHOLDS.CLOSED_FINGER_COUNT;
    
    // Calculate confidence based on landmark stability
    this.gestureState.confidence = this.calculateConfidence(landmarks);
  }

  private calculateConfidence(landmarks: any[]): number {
    // Calculate stability of key landmarks
    const stability = landmarks.slice(0, 5).reduce((acc, landmark) => {
      return acc + Math.abs(landmark.z); // Z-depth stability
    }, 0) / 5;

    return Math.max(0, Math.min(1, 1 - stability));
  }
}