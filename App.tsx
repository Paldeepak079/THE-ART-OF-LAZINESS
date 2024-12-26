import React, { useRef } from 'react';
import { VideoPreview } from './components/VideoPreview';
import { GestureDebugPanel } from './components/debug/GestureDebugPanel';
import { Header } from './components/Header';
import { useGestureDetection } from './hooks/useGestureDetection';
import { useAudioGestures } from './hooks/useAudioGestures';
import { useAnimationFrame } from './hooks/useAnimationFrame';

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { gesture, error, processFrame } = useGestureDetection(videoRef);
  
  // Process audio based on gestures
  useAudioGestures(gesture);
  
  // Process frames continuously
  useAnimationFrame(processFrame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="relative">
          <VideoPreview videoRef={videoRef} />
          <GestureDebugPanel gesture={gesture} error={error} />
        </div>
      </main>
    </div>
  );
}

export default App;