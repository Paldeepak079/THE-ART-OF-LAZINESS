export class ColorPalette {
  constructor(
    public primary: string,
    public secondary: string,
    public accent: string,
    public glow: string
  ) {}

  static generateFromVolume(volume: number): ColorPalette {
    const hue = volume * 360;
    
    return new ColorPalette(
      `hsla(${hue}, 80%, 50%, 0.8)`,
      `hsla(${hue + 30}, 70%, 60%, 0.6)`,
      `hsla(${hue + 60}, 90%, 70%, 0.9)`,
      `hsla(${hue + 15}, 85%, 55%, 0.5)`
    );
  }
}