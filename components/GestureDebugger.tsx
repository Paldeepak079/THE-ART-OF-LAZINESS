import React from 'react';
import { HandGesture } from '../types';
import { Bug } from 'lucide-react';

interface Props {
  gesture: HandGesture | null;
  error: Error | null;
}

export const GestureDebugger: React.FC<Props> = ({ gesture, error }) => {
  if (!gesture && !error) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-black/50 p-4 rounded-lg text-white">
      <div className="flex items-center gap-2 mb-2">
        <Bug className="w-4 h-4" />
        <h3 className="text-lg font-semibold">Gesture Debug</h3>
      </div>
      
      {error && (
        <div className="text-red-400 text-sm mb-2">
          Error: {error.message}
        </div>
      )}

      {gesture && (
        <div className="space-y-1 text-sm">
          <p>Hand Raised: {gesture.isRaised ? 'Yes' : 'No'}</p>
          <p>Hand Closed: {gesture.isClosed ? 'Yes' : 'No'}</p>
          <div className="mt-2">
            <p className="font-medium">Fingers:</p>
            <div className="grid grid-cols-5 gap-1 mt-1">
              {Object.entries(gesture.fingers).map(([finger, isExtended]) => (
                <div
                  key={finger}
                  className={`h-4 w-4 rounded ${
                    isExtended ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  title={`${finger}: ${isExtended ? 'Extended' : 'Closed'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};