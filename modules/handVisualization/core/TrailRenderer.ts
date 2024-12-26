import { HandLandmarks, Trail } from '../types';
import { VisualizerConfig } from '../config/visualizerConfig';
import { createTrail, updateTrail } from '../utils/trailUtils';

export class TrailRenderer {
  private ctx: CanvasRenderingContext2D;
  private trails: Trail[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  update(landmarks: HandLandmarks[]): void {
    // Update existing trails
    this.trails = this.trails
      .map(updateTrail)
      .filter(trail => trail.points.length > 0);

    // Add new trail points for fingertips
    const fingertips = [4, 8, 12, 16, 20];
    fingertips.forEach(index => {
      const landmark = landmarks[index];
      if (landmark) {
        const existingTrail = this.trails.find(t => t.fingerId === index);
        if (existingTrail) {
          existingTrail.points.unshift({ x: landmark.x, y: landmark.y });
        } else {
          this.trails.push(createTrail(index, landmark));
        }
      }
    });
  }

  render(): void {
    const { ctx } = this;

    this.trails.forEach(trail => {
      if (trail.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(trail.points[0].x, trail.points[0].y);

      for (let i = 1; i < trail.points.length; i++) {
        const point = trail.points[i];
        const prevPoint = trail.points[i - 1];
        
        const controlPoint = {
          x: (prevPoint.x + point.x) / 2,
          y: (prevPoint.y + point.y) / 2
        };

        ctx.quadraticCurveTo(
          prevPoint.x,
          prevPoint.y,
          controlPoint.x,
          controlPoint.y
        );
      }

      const gradient = ctx.createLinearGradient(
        trail.points[0].x,
        trail.points[0].y,
        trail.points[trail.points.length - 1].x,
        trail.points[trail.points.length - 1].y
      );

      gradient.addColorStop(0, `hsla(${trail.hue}, 100%, 60%, 0.8)`);
      gradient.addColorStop(1, `hsla(${trail.hue}, 100%, 60%, 0)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = VisualizerConfig.TRAILS.LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }
}