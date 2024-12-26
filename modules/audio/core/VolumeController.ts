import * as Tone from 'tone';
import { AudioConfig } from '../config/audioConfig';

export class VolumeController {
  private volume: Tone.Volume;
  private currentVolume: number;
  
  constructor() {
    this.volume = new Tone.Volume(AudioConfig.VOLUME.min).toDestination();
    this.currentVolume = AudioConfig.VOLUME.min;
  }

  updateVolume(handPosition: number): void {
    // Map hand position (0-1) to volume range
    const targetVolume = this.mapToVolume(handPosition);
    
    // Smooth volume changes
    this.currentVolume = this.smoothVolume(targetVolume);
    
    // Apply volume change
    this.volume.volume.rampTo(this.currentVolume, 0.1);
  }

  private mapToVolume(position: number): number {
    const { min, max } = AudioConfig.VOLUME;
    return min + (max - min) * (1 - position);
  }

  private smoothVolume(target: number): number {
    return this.currentVolume + 
      (target - this.currentVolume) * 
      (1 - AudioConfig.VOLUME.smoothing);
  }

  getNode(): Tone.Volume {
    return this.volume;
  }

  dispose(): void {
    this.volume.dispose();
  }
}