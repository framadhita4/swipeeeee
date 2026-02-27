import { describe, it, expect } from 'vitest';
import { lerp, damp, symmetricMod, calculateForce, normalize } from './math';

describe('lerp', () => {
  it('returns v0 when t=0', () => {
    expect(lerp(0, 10, 0)).toBe(0);
  });

  it('returns v1 when t=1', () => {
    expect(lerp(0, 10, 1)).toBe(10);
  });

  it('returns midpoint when t=0.5', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  it('works with negative values', () => {
    expect(lerp(-10, 10, 0.5)).toBe(0);
  });

  it('works when v0 equals v1', () => {
    expect(lerp(5, 5, 0.5)).toBe(5);
  });
});

describe('damp', () => {
  it('returns a when deltaTime is 0', () => {
    expect(damp(0, 10, 1, 0)).toBe(0);
  });

  it('converges very close to b when lambda is very large', () => {
    expect(damp(0, 10, 1000, 1)).toBeCloseTo(10);
  });

  it('moves toward b over time', () => {
    const result = damp(0, 10, 1, 0.5);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10);
  });

  it('returns a when a equals b', () => {
    expect(damp(5, 5, 1, 0.5)).toBe(5);
  });
});

describe('symmetricMod', () => {
  it('returns 0 when value is 0', () => {
    expect(symmetricMod(0, 4)).toBe(0);
  });

  it('returns the remainder when within the positive half', () => {
    expect(symmetricMod(1, 4)).toBe(1);
  });

  it('wraps to negative when remainder exceeds half of base', () => {
    // 3 % 4 = 3, and 3 > 4/2=2, so wraps to 3 - 4 = -1
    expect(symmetricMod(3, 4)).toBe(-1);
  });

  it('wraps to positive when negative remainder exceeds half of base', () => {
    // -3 % 4 = -3, and abs(-3) > 2, so wraps to -3 + 4 = 1
    expect(symmetricMod(-3, 4)).toBe(1);
  });

  it('does not wrap at exactly half of base', () => {
    // 2 % 4 = 2, and abs(2) > 2 is false, so no wrap
    expect(symmetricMod(2, 4)).toBe(2);
  });

  it('handles values that are exact multiples of base', () => {
    expect(symmetricMod(4, 4)).toBe(0);
    expect(symmetricMod(8, 4)).toBe(0);
  });
});

describe('calculateForce', () => {
  it('multiplies velocity by deltaTime', () => {
    expect(calculateForce(5, 0.016)).toBeCloseTo(0.08);
  });

  it('returns 0 when velocity is 0', () => {
    expect(calculateForce(0, 1)).toBe(0);
  });

  it('returns 0 when deltaTime is 0', () => {
    expect(calculateForce(5, 0)).toBe(0);
  });

  it('returns negative force for negative velocity', () => {
    expect(calculateForce(-5, 0.016)).toBeCloseTo(-0.08);
  });
});

describe('normalize', () => {
  it('returns 0 when value equals min', () => {
    expect(normalize(0, 0, 10)).toBe(0);
  });

  it('returns 1 when value equals max', () => {
    expect(normalize(10, 0, 10)).toBe(1);
  });

  it('returns 0.5 for the midpoint', () => {
    expect(normalize(5, 0, 10)).toBe(0.5);
  });

  it('clamps to 0 when value is below min (clamp=true by default)', () => {
    expect(normalize(-5, 0, 10)).toBe(0);
  });

  it('clamps to 1 when value is above max (clamp=true by default)', () => {
    expect(normalize(15, 0, 10)).toBe(1);
  });

  it('does not clamp when clamp=false', () => {
    expect(normalize(-5, 0, 10, false)).toBe(-0.5);
    expect(normalize(15, 0, 10, false)).toBe(1.5);
  });

  it('returns 0 when min equals max', () => {
    expect(normalize(5, 5, 5)).toBe(0);
  });
});
