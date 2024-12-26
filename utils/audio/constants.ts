export const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4'] as const;
export const DEFAULT_VOLUME = 0.5;
export const MIN_VOLUME = 0;
export const MAX_VOLUME = 1;

export const VOLUME_SMOOTHING = 0.1; // For smooth volume transitions
export const NOTE_DURATION = '8n';    // Note duration in Tone.js format

export const FINGER_TO_NOTE_MAP = {
  thumb: 'C4',
  index: 'D4',
  middle: 'E4',
  ring: 'F4',
  pinky: 'G4'
} as const;