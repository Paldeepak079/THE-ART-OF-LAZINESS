import { HandLandmarks, Particle } from '../types';
import { VisualizerConfig } from '../config/visualizerConfig';
import { createParticle, updateParticle } from '../utils/particleUtils';

export class ParticleSystem {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private isHandClosed = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  update(landmarks: HandLandmarks[], isHandClosed: boolean): void {
    this.isHandClosed = isHandClosed;

    // Remove dead particles
    this.particles = this.particles.filter(p => p.life > 0);

    // Add new particles at fingertips
    if (!isHandClosed) {
      const fingertips = [4, 8, 12, 16, 20]; // Fingertip indices
      fingertips.forEach(index => {
        const landmark = landmarks[index];
        if (landmark) {
          for (let i = 0; i < VisualizerConfig.PARTICLES.EMIT_RATE; i++) {
            this.particles.push(createParticle(landmark));
          }
        }
      });
    }

    // Update existing particles
    this.particles.forEach(particle => updateParticle(particle));
  }

  render(): void {
    const { ctx } = this;

    this.particles.forEach(particle => {
      const alpha = particle.life;
      const size = particle.size * (1 + Math.sin(particle.life * Math.PI));
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, size
      );
      
      gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${alpha})`);
      gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 60%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }
}