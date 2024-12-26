import { VisualizerConfig } from '../config/visualizerConfig';
import { ColorPalette } from '../utils/colorUtils';

export class WaveformRenderer {
  private ctx: CanvasRenderingContext2D;
  private gestureState = { isRaised: false, isClosed: false };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  render(dataArray: Uint8Array, volume: number, colors: ColorPalette): void {
    const { width, height } = this.ctx.canvas;
    const sliceWidth = width / dataArray.length;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = colors.primary;
    this.ctx.lineWidth = VisualizerConfig.WAVEFORM.LINE_WIDTH * (1 + volume);

    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();

    if (!this.gestureState.isClosed) {
      this.addGlow(colors);
    }
  }

  private addGlow(colors: ColorPalette): void {
    this.ctx.shadowBlur = VisualizerConfig.WAVEFORM.GLOW_INTENSITY;
    this.ctx.shadowColor = colors.glow;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  updateGestureState(state: { isRaised: boolean; isClosed: boolean }): void {
    this.gestureState = state;
  }
}