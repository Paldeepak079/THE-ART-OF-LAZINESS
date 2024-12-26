import { VisualizerConfig } from '../config/visualizerConfig';
import { ColorPalette } from '../utils/colorUtils';

export class FrequencyRenderer {
  private ctx: CanvasRenderingContext2D;
  private gestureState = { isRaised: false, isClosed: false };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  render(dataArray: Uint8Array, volume: number, colors: ColorPalette): void {
    if (this.gestureState.isClosed) return;

    const { width, height } = this.ctx.canvas;
    const barWidth = width / VisualizerConfig.FREQUENCY.BAR_COUNT;
    const heightScale = height / 256;

    for (let i = 0; i < VisualizerConfig.FREQUENCY.BAR_COUNT; i++) {
      const value = dataArray[i];
      const barHeight = value * heightScale;
      const x = i * barWidth;
      const y = height - barHeight;

      const hue = (i / VisualizerConfig.FREQUENCY.BAR_COUNT) * 360;
      this.ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${volume})`;
      
      this.ctx.fillRect(
        x,
        y,
        barWidth - VisualizerConfig.FREQUENCY.BAR_SPACING,
        barHeight
      );

      if (this.gestureState.isRaised) {
        this.addGlow(x, y, barWidth, barHeight, colors);
      }
    }
  }

  private addGlow(
    x: number,
    y: number,
    width: number,
    height: number,
    colors: ColorPalette
  ): void {
    this.ctx.shadowBlur = VisualizerConfig.FREQUENCY.GLOW_INTENSITY;
    this.ctx.shadowColor = colors.glow;
    this.ctx.fillRect(x, y, width - VisualizerConfig.FREQUENCY.BAR_SPACING, height);
    this.ctx.shadowBlur = 0;
  }

  updateGestureState(state: { isRaised: boolean; isClosed: boolean }): void {
    this.gestureState = state;
  }
}