import { HandLandmarks, Particle } from '../types';
import { VisualizerConfig } from '../config/visualizerConfig';

export function createParticle(landmark: HandLandmarks): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * VisualizerConfig.PARTICLES.MAX_SPEED;

  return {
    x: landmark.x,
    y: landmark.y,
    size: Math.random() * 
      (VisualizerConfig.PARTICLES.MAX_SIZE - VisualizerConfig.PARTICLES.MIN_SIZE) + 
      VisualizerConfig.PARTICLES.MIN_SIZE,
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
    life: 1,
    hue: Math.random() * 60 + 200 // Blue-purple range
  };
}

export function updateParticle(particle: Particle): void {
  particle.x += particle.speedX;
  particle.y += particle.speedY;
  particle.life -= VisualizerConfig.PARTICLES.DECAY_RATE;
  
  // Add some turbulence
  particle.speedX += (Math.random() - 0.5) * 0.1;
  particle.speedY += (Math.random() - 0.5) * 0.1;
}