import React from 'react';
import { Hand } from 'lucide-react';

interface Props {
  fingers: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  };
}

export const FingerStateVisualizer: React.FC<Props> = ({ fingers }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Hand className="w-4 h-4" />
        <span className="font-medium">Finger States</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(fingers).map(([finger, isExtended]) => (
          <div key={finger} className="flex flex-col items-center">
            <div
              className={`w-4 h-8 rounded-full transition-colors ${
                isExtended ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={`${finger}: ${isExtended ? 'Extended' : 'Closed'}`}
            />
            <span className="text-xs mt-1 capitalize">{finger}</span>
          </div>
        ))}
      </div>
    </div>
  );
};