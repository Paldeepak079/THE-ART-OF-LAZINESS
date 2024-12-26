import { Landmark, Position } from '../types';
import { GestureConfig } from '../config/gestureConfig';

export class PositionTracker {
  private lastPosition: Position | null = null;

  trackPosition(landmarks: Landmark[]): Position {
    const currentPosition = this.calculatePosition(landmarks);
    
    if (!this.lastPosition) {
      this.lastPosition = currentPosition;
      return currentPosition;
    }

    const smoothedPosition = this.smoothPosition(currentPosition);
    this.lastPosition = smoothedPosition;
    
    return smoothedPosition;
  }

  private calculatePosition(landmarks: Landmark[]): Position {
    const wrist = landmarks[0];
    return { x: wrist.x, y: wrist.y };
  }

  private smoothPosition(current: Position): Position {
    if (!this.lastPosition) return current;

    const alpha = GestureConfig.SMOOTHING_FACTOR;
    return {
      x: this.lastPosition.x + alpha * (current.x - this.lastPosition.x),
      y: this.lastPosition.y + alpha * (current.y - this.lastPosition.y)
    };
  }
}