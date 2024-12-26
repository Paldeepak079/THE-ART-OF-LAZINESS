export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
}

export interface VisualizationState {
  isActive: boolean;
  volume: number;
  gestureState: {
    isRaised: boolean;
    isClosed: boolean;
  };
}