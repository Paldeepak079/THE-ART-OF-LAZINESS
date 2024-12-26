import * as Tone from 'tone';

export class VolumeController {
  private currentVolume = 0;

  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    Tone.Destination.volume.value = Tone.gainToDb(this.currentVolume);
  }

  getCurrentVolume(): number {
    return this.currentVolume;
  }
}