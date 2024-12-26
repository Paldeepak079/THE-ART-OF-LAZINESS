import { VisualizerConfig } from '../config/visualizerConfig';
import { ColorPalette } from '../utils/colorUtils';
import { Particle } from '../types';

export class ParticleRenderer {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private gestureState = { isRaised: false, isClosed: false };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initializeParticles();
  }

  private initializeParticles(): void {
    const { width, height } = this.ctx.canvas;
    const count = VisualizerConfig.PARTICLES.COUNT;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        life: 1
      });
    }
  }

  render(dataArray: Uint8Array, volume: number, colors: ColorPalette): void {
    if (this.gestureState.isClosed) return;

    this.particles.forEach((particle, index) => {
      this.updateParticle(particle, volume);
      this.drawParticle(particle, colors);

      if (particle.life <= 0) {
        this.resetParticle(particle);
      }
    });
  }

  private updateParticle(particle: Particle, volume: number): void {
    const speed = VisualizerConfig.PARTICLES.BASE_SPEED * (1 + volume);
    
    particle.x += particle.speedX * speed;
    particle.y += particle.speedY * speed;
    particle.life -= VisualizerConfig.PARTICLES.DECAY_RATE;

    this.handleBoundaries(particle);
  }

  private drawParticle(particle: Particle, colors: ColorPalette): void {
    const { ctx } = this;
    
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = colors.secondary + Math.floor(particle.life * 255).toString(16);
    ctx.fill();

    if (this.gestureState.isRaised) {
      ctx.shadowBlur = VisualizerConfig.PARTICLES.GLOW_INTENSITY;
      ctx.shadowColor = colors.glow;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  private handleBoundaries(particle: Particle): void {
    const { width, height } = this.ctx.canvas;

    if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
  }

  private resetParticle(particle: Particle): void {
    const { width, height } = this.ctx.canvas;
    
    particle.x = Math.random() * width;
    particle.y = Math.random() * height;
    particle.life = 1;
    particle.speedX = Math.random() * 2 - 1;
    particle.speedY = Math.random() * 2 - 1;
  }

  updateGestureState(state: { isRaised: boolean; isClosed: boolean }): void {
    this.gestureState = state;
  }
}