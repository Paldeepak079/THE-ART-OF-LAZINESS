import { HandLandmarks } from './types';
import { LANDMARK_INDICES } from './constants';

export const validateLandmarks = (landmarks: HandLandmarks[]): boolean => {
  if (!Array.isArray(landmarks) || landmarks.length === 0) {
    return false;
  }

  return Object.values(LANDMARK_INDICES).every(index => {
    const landmark = landmarks[index];
    return (
      landmark &&
      typeof landmark.x === 'number' &&
      typeof landmark.y === 'number' &&
      typeof landmark.z === 'number' &&
      !isNaN(landmark.x) &&
      !isNaN(landmark.y) &&
      !isNaN(landmark.z)
    );
  });
};