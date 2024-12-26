import { HandLandmarks } from './types';
import { LANDMARK_INDICES } from './constants';

export const isValidLandmarks = (landmarks: HandLandmarks[]): boolean => {
  if (!Array.isArray(landmarks) || landmarks.length === 0) {
    return false;
  }

  // Check if all required landmark points are present
  return Object.values(LANDMARK_INDICES).every(index => 
    landmarks[index] && 
    typeof landmarks[index].x === 'number' && 
    typeof landmarks[index].y === 'number' && 
    typeof landmarks[index].z === 'number'
  );
};