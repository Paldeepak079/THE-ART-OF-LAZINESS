import { create } from 'zustand';
import { AudioState } from '../types';
import { DEFAULT_VOLUME } from '../utils/audio/constants';

interface AudioStore extends AudioState {
  setPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentNote: (note: string | null) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  isPlaying: false,
  volume: DEFAULT_VOLUME,
  currentNote: null,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setCurrentNote: (note) => set({ currentNote: note }),
}));