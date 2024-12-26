export class GestureProcessingError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'GestureProcessingError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ProcessingLockError extends Error {
  constructor() {
    super('Gesture processing is already in progress');
    this.name = 'ProcessingLockError';
  }
}