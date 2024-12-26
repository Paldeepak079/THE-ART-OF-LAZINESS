import React from 'react';
import { HandGesture } from '../types';

interface Props {
  gesture: HandGesture | null;
}

export const GestureVisualizer: React.FC<Props> = ({ gesture }) => {
  if (!gesture) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-black/50 p-4 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Gesture Debug</h3>
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
    </div>
  );
};