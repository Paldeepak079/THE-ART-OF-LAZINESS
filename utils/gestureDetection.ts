import { HandGesture } from '../types';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let handLandmarker: HandLandmarker | null = null;

const initializeHandLandmarker = async (): Promise<HandLandmarker> => {
  if (handLandmarker) return handLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );
  
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate: 'GPU'
    },
    numHands: 1,
    runningMode: 'VIDEO'
  });

  return handLandmarker;
};

export const detectHandGesture = async (video: HTMLVideoElement): Promise<HandGesture | null> => {
  try {
    const landmarker = await initializeHandLandmarker();
    const result = await landmarker.detect(video);

    if (!result.landmarks || result.landmarks.length === 0) {
      return null;
    }

    const landmarks = result.landmarks[0];
    
    // Calculate hand position and gestures
    const wristY = landmarks[0].y;
    const palmY = (landmarks[5].y + landmarks[17].y) / 2;
    const isRaised = wristY > palmY;
    
    // Calculate finger states
    const fingers = {
      thumb: landmarks[4].y < landmarks[3].y,
      index: landmarks[8].y < landmarks[7].y,
      middle: landmarks[12].y < landmarks[11].y,
      ring: landmarks[16].y < landmarks[15].y,
      pinky: landmarks[20].y < landmarks[19].y
    };

    const isClosed = !Object.values(fingers).some(finger => finger);

    return {
      isRaised,
      isClosed,
      position: {
        x: landmarks[0].x,
        y: landmarks[0].y
      },
      fingers
    };
  } catch (error) {
    console.error('Error detecting hand gesture:', error);
    return null;
  }
};