import { HandLandmarks } from '../types';
import { ParticleSystem } from './ParticleSystem';
import { TrailRenderer } from './TrailRenderer';
import { JointRenderer } from './JointRenderer';
import { VisualizerConfig } from '../config/visualizerConfig';
import { smoothLandmarks } from '../utils/smoothing';

export class HandVisualizer {
  private ctx: CanvasRenderingContext2D;
  private particleSystem: ParticleSystem;
  private trailRenderer: TrailRenderer;
  private jointRenderer: JointRenderer;
  private lastLandmarks: HandLandmarks[] | null = null;
  private animationFrame: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.setupRenderers();
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  private setupRenderers(): void {
    this.particleSystem = new ParticleSystem(this.ctx);
    this.trailRenderer = new TrailRenderer(this.ctx);
    this.jointRenderer = new JointRenderer(this.ctx);
  }

  private resizeCanvas(): void {
    const canvas = this.ctx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  update(landmarks: HandLandmarks[] | null, isHandClosed: boolean): void {
    if (!landmarks) {
      this.lastLandmarks = null;
      return;
    }

    const smoothedLandmarks = this.lastLandmarks 
      ? smoothLandmarks(landmarks, this.lastLandmarks)
      : landmarks;

    this.particleSystem.update(smoothedLandmarks, isHandClosed);
    this.trailRenderer.update(smoothedLandmarks);
    this.jointRenderer.update(smoothedLandmarks);

    this.lastLandmarks = smoothedLandmarks;
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.trailRenderer.render();
    this.particleSystem.render();
    this.jointRenderer.render();

    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  start(): void {
    if (!this.animationFrame) {
      this.render();
    }
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }
}