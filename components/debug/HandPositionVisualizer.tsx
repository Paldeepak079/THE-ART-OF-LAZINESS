import React from 'react';
import { MoveVertical, MoveHorizontal } from 'lucide-react';

interface Props {
  position: {
    x: number;
    y: number;
  };
}

export const HandPositionVisualizer: React.FC<Props> = ({ position }) => {
  const formatPosition = (value: number) => (value * 100).toFixed(1) + '%';

  return (
    <div className="space-y-2">
      <div className="font-medium mb-2">Hand Position</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MoveHorizontal className="w-4 h-4" />
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-200"
              style={{ width: `${position.x * 100}%` }}
            />
          </div>
          <span className="text-xs w-16 text-right">{formatPosition(position.x)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MoveVertical className="w-4 h-4" />
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-200"
              style={{ width: `${position.y * 100}%` }}
            />
          </div>
          <span className="text-xs w-16 text-right">{formatPosition(position.y)}</span>
        </div>
      </div>
    </div>
  );
};