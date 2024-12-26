import React from 'react';
import { Bug } from 'lucide-react';
import { HandGesture } from '../../types';
import { FingerStateVisualizer } from './FingerStateVisualizer';
import { HandPositionVisualizer } from './HandPositionVisualizer';
import { ErrorDisplay } from '../ErrorDisplay';

interface Props {
  gesture: HandGesture | null;
  error: Error | null;
}

export const GestureDebugPanel: React.FC<Props> = ({ gesture, error }) => {
  if (!gesture && !error) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-4 rounded-lg text-white min-w-[240px]">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/20">
        <Bug className="w-4 h-4" />
        <h3 className="text-lg font-semibold">Gesture Debug</h3>
      </div>
      
      {error && <ErrorDisplay error={error} className="mb-4" />}

      {gesture && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Hand Raised:</span>
              <span className={gesture.isRaised ? 'text-green-400' : 'text-red-400'}>
                {gesture.isRaised ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Hand Closed:</span>
              <span className={gesture.isClosed ? 'text-yellow-400' : 'text-blue-400'}>
                {gesture.isClosed ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <HandPositionVisualizer position={gesture.position} />
          <FingerStateVisualizer fingers={gesture.fingers} />
        </div>
      )}
    </div>
  );
};