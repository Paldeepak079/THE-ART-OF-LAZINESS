import { useState, useEffect } from 'react';
import { cameraService } from '../services/camera/CameraService';
import type { CameraError } from '../utils/errors';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<CameraError | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      if (isInitializing) return;
      
      setIsInitializing(true);
      setError(null);

      try {
        const mediaStream = await cameraService.initialize();
        if (mounted) {
          setStream(mediaStream);
        }
      } catch (err) {
        if (mounted) {
          setError(err as CameraError);
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      cameraService.stopStream();
    };
  }, []);

  return { stream, error, isInitializing };
};