import React from 'react';
import { HandMetal, Music } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <HandMetal className="w-8 h-8" />
        <h1 className="text-3xl font-bold">The Art of Laziness</h1>
        <Music className="w-8 h-8" />
      </div>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
        Control music with hand gestures. Raise your hand to start, move it up/down for volume,
        close it to pause, and play individual notes with your fingers.
      </p>
    </header>
  );
};