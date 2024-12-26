export type InstrumentType = 'synth' | 'pluck' | 'membrane';

export interface FingerStates {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

export interface Position {
  x: number;
  y: number;
  velocity: number;
}

export interface AudioState {
  isRaised: boolean;
  isClosed: boolean;
  position: {
    x: number;
    y: number;
  };
  velocity: number;
  fingers: FingerStates;
}