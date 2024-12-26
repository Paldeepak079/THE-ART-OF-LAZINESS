import React, { useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { ErrorDisplay } from './ErrorDisplay';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoPreview: React.FC<Props> = ({ videoRef }) => {
  const { stream, error, isInitializing } = useCamera();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream, videoRef]);

  if (error) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg mirror"
        autoPlay
        playsInline
        muted
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg backdrop-blur-sm">
          <div className="text-center text-white">
            <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">
              {isInitializing ? 'Accessing camera...' : 'Camera not connected'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};