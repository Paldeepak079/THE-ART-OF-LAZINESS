export class GestureDetectionError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'GestureDetectionError';
  }
}

export class ModelLoadError extends GestureDetectionError {
  constructor(message: string, cause?: Error) {
    super(`Failed to load hand detection model: ${message}`, cause);
    this.name = 'ModelLoadError';
  }
}

export class DetectionError extends GestureDetectionError {
  constructor(message: string, cause?: Error) {
    super(`Hand detection failed: ${message}`, cause);
    this.name = 'DetectionError';
  }
}