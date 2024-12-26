export interface CameraState {
  stream: MediaStream | null;
  error: Error | null;
  isInitializing: boolean;
}