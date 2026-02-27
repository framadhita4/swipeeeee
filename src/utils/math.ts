export function lerp(v0: number, v1: number, t: number): number {
  return v0 * (1 - t) + v1 * t;
}

export function damp(
  a: number,
  b: number,
  lambda: number,
  deltaTime: number
): number {
  const t = 1 - Math.exp(-lambda * deltaTime);
  return a + (b - a) * t;
}

export function symmetricMod(value: number, base: number): number {
  let m = value % base;
  if (Math.abs(m) > base / 2) {
    m = m > 0 ? m - base : m + base;
  }
  return m;
}

export function calculateForce(velocity: number, deltaTime: number): number {
  return velocity * deltaTime;
}

export function normalize(
  value: number,
  min: number,
  max: number,
  clamp = true
): number {
  if (min === max) return 0;
  const normalized = (value - min) / (max - min);
  if (!clamp) return normalized;
  return Math.min(1, Math.max(0, normalized));
}
