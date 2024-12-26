export type NoteName = 'C4' | 'D4' | 'E4' | 'F4' | 'G4';
export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export interface AudioEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  volume: number;
  activeNotes: Set<NoteName>;
}

export interface AudioOptions {
  volume?: number;
  noteDuration?: string;
}