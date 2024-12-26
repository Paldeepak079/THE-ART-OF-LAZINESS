import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_CDN_URL, HAND_LANDMARKER_MODEL_URL, RETRY_ATTEMPTS, RETRY_DELAY } from './constants';
import { ModelLoadError } from './errors';

let handLandmarker: HandLandmarker | null = null;
let initializationPromise: Promise<HandLandmarker> | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeWithRetry = async (attempts: number = RETRY_ATTEMPTS): Promise<HandLandmarker> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_CDN_URL);
      
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_LANDMARKER_MODEL_URL,
          delegate: 'GPU'
        },
        numHands: 1,
        runningMode: 'VIDEO'
      });

      return handLandmarker;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Attempt ${attempt}/${attempts} failed:`, error);
      
      if (attempt < attempts) {
        await delay(RETRY_DELAY * attempt); // Exponential backoff
      }
    }
  }

  throw new ModelLoadError('Max retry attempts reached', lastError || undefined);
};

export const initializeHandLandmarker = async (): Promise<HandLandmarker> => {
  if (handLandmarker) return handLandmarker;
  
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = initializeWithRetry();
  
  try {
    const result = await initializationPromise;
    return result;
  } catch (error) {
    initializationPromise = null;
    throw error;
  }
};