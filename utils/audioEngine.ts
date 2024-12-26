import * as Tone from 'tone';

class AudioEngine {
  private synth: Tone.PolySynth;
  private notes: string[];
  
  constructor() {
    this.synth = new Tone.PolySynth().toDestination();
    this.notes = ['C4', 'D4', 'E4', 'F4', 'G4'];
  }

  start() {
    Tone.start();
  }

  playNote(fingerIndex: number) {
    if (fingerIndex >= 0 && fingerIndex < this.notes.length) {
      this.synth.triggerAttackRelease(this.notes[fingerIndex], '8n');
    }
  }

  setVolume(volume: number) {
    this.synth.volume.value = Tone.gainToDb(volume);
  }

  stop() {
    this.synth.releaseAll();
  }
}

export const audioEngine = new AudioEngine();