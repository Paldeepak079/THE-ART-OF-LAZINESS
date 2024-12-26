import { CameraError } from '../errors';
import { CAMERA_CONSTRAINTS } from './constants';
import { validateCameraSupport } from './validation';

export const getCameraStream = async (): Promise<MediaStream> => {
  try {
    await validateCameraSupport();

    const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
    
    // Verify that we got video tracks
    if (!stream.getVideoTracks().length) {
      throw new CameraError('No video tracks available in the camera stream');
    }

    return stream;
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'NotAllowedError':
          throw new CameraError('Camera access denied. Please grant permission.');
        case 'NotFoundError':
          throw new CameraError('No camera device found.');
        case 'NotReadableError':
          throw new CameraError('Camera is already in use. Please close other applications using the camera.');
        default:
          throw new CameraError(err.message);
      }
    }
    throw new CameraError('Failed to access camera');
  }
};

export const releaseCameraStream = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
      stream.removeTrack(track);
    });
  }
};