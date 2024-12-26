import { HandLandmarks } from '../types';
import { VisualizerConfig } from '../config/visualizerConfig';

export class JointRenderer {
  private ctx: CanvasRenderingContext2D;
  private landmarks: HandLandmarks[] | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  update(landmarks: HandLandmarks[]): void {
    this.landmarks = landmarks;
  }

  render(): void {
    if (!this.landmarks) return;

    const { ctx } = this;
    const connections = VisualizerConfig.HAND_CONNECTIONS;

    // Draw connections
    ctx.beginPath();
    ctx.strokeStyle = VisualizerConfig.JOINTS.CONNECTION_COLOR;
    ctx.lineWidth = VisualizerConfig.JOINTS.CONNECTION_WIDTH;

    connections.forEach(([start, end]) => {
      const startPoint = this.landmarks![start];
      const endPoint = this.landmarks![end];

      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
    });

    ctx.stroke();

    // Draw joints
    this.landmarks.forEach((landmark, index) => {
      const isFingerTip = [4, 8, 12, 16, 20].includes(index);
      const radius = isFingerTip 
        ? VisualizerConfig.JOINTS.FINGERTIP_RADIUS 
        : VisualizerConfig.JOINTS.JOINT_RADIUS;

      ctx.beginPath();
      ctx.arc(landmark.x, landmark.y, radius, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(
        landmark.x, landmark.y, 0,
        landmark.x, landmark.y, radius
      );

      gradient.addColorStop(0, VisualizerConfig.JOINTS.INNER_COLOR);
      gradient.addColorStop(1, VisualizerConfig.JOINTS.OUTER_COLOR);

      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }
}