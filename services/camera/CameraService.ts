import { CameraError } from '../../utils/errors';

const CAMERA_CONSTRAINTS = {
  video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: false
};

export class CameraService {
  private static instance: CameraService;
  private stream: MediaStream | null = null;

  private constructor() {}

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  async initialize(): Promise<MediaStream> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new CameraError('Camera access not supported');
      }

      // Stop any existing stream
      await this.stopStream();

      // Request new stream
      this.stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      
      if (!this.stream.getVideoTracks().length) {
        throw new CameraError('No video track available');
      }

      return this.stream;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to access camera';
      throw new CameraError(message);
    }
  }

  async stopStream(): Promise<void> {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  getStream(): MediaStream | null {
    return this.stream;
  }
}

export const cameraService = CameraService.getInstance();