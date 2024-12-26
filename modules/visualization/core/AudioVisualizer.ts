import { VisualizerConfig } from '../config/visualizerConfig';
import { WaveformRenderer } from './renderers/WaveformRenderer';
import { ParticleRenderer } from './renderers/ParticleRenderer';
import { FrequencyRenderer } from './renderers/FrequencyRenderer';
import { ColorPalette } from '../utils/colorUtils';

export class AudioVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyzer: AnalyserNode;
  private dataArray: Uint8Array;
  private waveformRenderer: WaveformRenderer;
  private particleRenderer: ParticleRenderer;
  private frequencyRenderer: FrequencyRenderer;
  private animationFrame: number;
  private isActive = false;

  constructor(canvas: HTMLCanvasElement, analyzer: AnalyserNode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.analyzer = analyzer;
    this.dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    this.setupRenderers();
    this.resizeCanvas();
    this.addEventListeners();
  }

  private setupRenderers(): void {
    this.waveformRenderer = new WaveformRenderer(this.ctx);
    this.particleRenderer = new ParticleRenderer(this.ctx);
    this.frequencyRenderer = new FrequencyRenderer(this.ctx);
  }

  private resizeCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private addEventListeners(): void {
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  start(): void {
    this.isActive = true;
    this.animate();
  }

  stop(): void {
    this.isActive = false;
    cancelAnimationFrame(this.animationFrame);
  }

  private animate = (): void => {
    if (!this.isActive) return;

    this.analyzer.getByteTimeDomainData(this.dataArray);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const volume = this.calculateVolume();
    const colorPalette = ColorPalette.generateFromVolume(volume);

    this.waveformRenderer.render(this.dataArray, volume, colorPalette);
    this.particleRenderer.render(this.dataArray, volume, colorPalette);
    this.frequencyRenderer.render(this.dataArray, volume, colorPalette);

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private calculateVolume(): number {
    const sum = this.dataArray.reduce((acc, val) => acc + Math.abs(val - 128), 0);
    return sum / (this.dataArray.length * 128);
  }

  updateGestureState(gesture: { isRaised: boolean; isClosed: boolean }): void {
    this.particleRenderer.updateGestureState(gesture);
    this.waveformRenderer.updateGestureState(gesture);
  }

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }
}