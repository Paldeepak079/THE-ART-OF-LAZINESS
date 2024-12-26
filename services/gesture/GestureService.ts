import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_CONFIG } from '../../utils/gestureProcessing/config';
import { GestureError } from '../../utils/errors';
import type { HandLandmarks } from '../../types';

export class GestureService {
  private static instance: GestureService;
  private landmarker: HandLandmarker | null = null;
  private initializationPromise: Promise<HandLandmarker> | null = null;

  private constructor() {}

  static getInstance(): GestureService {
    if (!GestureService.instance) {
      GestureService.instance = new GestureService();
    }
    return GestureService.instance;
  }

  async initialize(): Promise<HandLandmarker> {
    if (this.landmarker) return this.landmarker;
    if (this.initializationPromise) return this.initializationPromise;

    try {
      this.initializationPromise = (async () => {
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.VISION_URL);
        const detector = await HandLandmarker.createFromOptions(vision, MEDIAPIPE_CONFIG.OPTIONS);
        this.landmarker = detector;
        return detector;
      })();

      return await this.initializationPromise;
    } catch (error) {
      this.initializationPromise = null;
      throw new GestureError(
        'Failed to initialize gesture detection',
        error instanceof Error ? error : undefined
      );
    }
  }

  async detectHand(video: HTMLVideoElement): Promise<HandLandmarks[] | null> {
    try {
      const landmarker = await this.initialize();
      const result = await landmarker.detect(video);
      return result.landmarks?.[0] || null;
    } catch (error) {
      console.error('Hand detection error:', error);
      throw new GestureError(
        'Failed to detect hand',
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const gestureService = GestureService.getInstance();