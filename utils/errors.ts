export class AppError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'AppError';
  }
}

export class CameraError extends AppError {
  constructor(message: string, cause?: Error) {
    super(`Camera Error: ${message}`, cause);
    this.name = 'CameraError';
  }
}

export class GestureError extends AppError {
  constructor(message: string, cause?: Error) {
    super(`Gesture Error: ${message}`, cause);
    this.name = 'GestureError';
  }
}

export class AudioError extends AppError {
  constructor(message: string, cause?: Error) {
    super(`Audio Error: ${message}`, cause);
    this.name = 'AudioError';
  }
}