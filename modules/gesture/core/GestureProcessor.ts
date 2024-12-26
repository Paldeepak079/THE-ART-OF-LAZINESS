import { HandGesture, GestureState, Landmark } from '../types';
import { FingerStateAnalyzer } from './FingerStateAnalyzer';
import { PositionTracker } from './PositionTracker';
import { GestureConfig } from '../config/gestureConfig';

export class GestureProcessor {
  private fingerAnalyzer = new FingerStateAnalyzer();
  private positionTracker = new PositionTracker();
  private gestureState: GestureState = {
    isRaised: false,
    isClosed: false,
    confidence: 0
  };

  processFrame(landmarks: Landmark[]): HandGesture | null {
    if (!this.validateLandmarks(landmarks)) return null;

    const position = this.positionTracker.trackPosition(landmarks);
    const fingers = this.fingerAnalyzer.analyzeFingers(landmarks);
    
    this.updateGestureState(landmarks, fingers);

    return {
      isRaised: this.gestureState.isRaised,
      isClosed: this.gestureState.isClosed,
      position,
      fingers,
      confidence: this.gestureState.confidence
    };
  }

  private validateLandmarks(landmarks: Landmark[]): boolean {
    return landmarks?.length >= GestureConfig.REQUIRED_LANDMARKS &&
           landmarks.every(l => 
             typeof l.x === 'number' && 
             typeof l.y === 'number' && 
             typeof l.z === 'number'
           );
  }

  private updateGestureState(landmarks: Landmark[], fingers: Record<string, boolean>): void {
    const wristY = landmarks[0].y;
    const palmY = (landmarks[5].y + landmarks[17].y) / 2;
    
    // Update raised state with hysteresis
    const deltaY = Math.abs(wristY - palmY);
    if (deltaY > GestureConfig.RAISED_THRESHOLD) {
      this.gestureState.isRaised = wristY < palmY;
    }

    // Update closed state
    const extendedFingers = Object.values(fingers).filter(f => f).length;
    this.gestureState.isClosed = extendedFingers <= GestureConfig.CLOSED_FINGER_COUNT;
    
    // Update confidence
    this.gestureState.confidence = this.calculateConfidence(landmarks);
  }

  private calculateConfidence(landmarks: Landmark[]): number {
    const depthStability = landmarks
      .slice(0, 5)
      .reduce((acc, l) => acc + Math.abs(l.z), 0) / 5;
    
    return Math.max(0, Math.min(1, 1 - depthStability));
  }
}