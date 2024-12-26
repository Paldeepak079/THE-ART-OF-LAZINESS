import { CameraError } from '../errors';

export const validateCameraSupport = async (): Promise<void> => {
  // Check basic getUserMedia support
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new CameraError('Camera access not supported in this browser');
  }

  // Check if any video input devices are available
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
    
    if (!hasVideoDevice) {
      throw new CameraError('No camera devices found');
    }
  } catch (err) {
    throw new CameraError('Failed to check camera availability');
  }
};