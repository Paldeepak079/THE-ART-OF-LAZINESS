export function calculateVelocity(
  current: { x: number; y: number },
  previous: { x: number; y: number }
): number {
  const dx = current.x - previous.x;
  const dy = current.y - previous.y;
  return Math.sqrt(dx * dx + dy * dy);
}