import { describe, it, expect } from 'vitest';
import { getSnapOffset, snapToNearest } from './snap.core';
import { createInitialState, DEFAULT_OPTIONS, ResolvedSwiperOptions } from '../../types';

function mockContainer(width: number): HTMLElement {
  return {
    getBoundingClientRect: () => ({ width }),
  } as unknown as HTMLElement;
}

describe('getSnapOffset', () => {
  it('returns 0 when snapAlign is "start"', () => {
    const state = createInitialState();
    state.itemWidth = 200;
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'start' };

    expect(getSnapOffset(mockContainer(500), options, state)).toBe(0);
  });

  it('returns 0 when itemWidth is 0', () => {
    const state = createInitialState(); // itemWidth defaults to 0
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'center', gap: 10 };

    expect(getSnapOffset(mockContainer(500), options, state)).toBe(0);
  });

  it('calculates the correct center snap offset', () => {
    const state = createInitialState();
    state.itemWidth = 200; // includes gap
    // slideWidth = 200 - 10 = 190
    // offset = (500 - 190) / 2 / 200 = 310 / 400 = 0.775
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'center', gap: 10 };

    expect(getSnapOffset(mockContainer(500), options, state)).toBeCloseTo(0.775);
  });

  it('returns 0 offset when slide fills the container exactly', () => {
    const state = createInitialState();
    state.itemWidth = 110; // slideWidth = 110 - 10 = 100
    // offset = (100 - 100) / 2 / 110 = 0
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'center', gap: 10 };

    expect(getSnapOffset(mockContainer(100), options, state)).toBeCloseTo(0);
  });
});

describe('snapToNearest', () => {
  it('rounds targetPosition to the nearest integer when snapAlign is "start"', () => {
    const state = createInitialState();
    state.itemWidth = 200;
    state.targetPosition = 1.7;
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'start' };

    snapToNearest(mockContainer(500), options, state);

    // offset=0, so Math.round(1.7 - 0) + 0 = 2
    expect(state.targetPosition).toBe(2);
  });

  it('rounds down to the nearest integer when snapAlign is "start"', () => {
    const state = createInitialState();
    state.itemWidth = 200;
    state.targetPosition = 1.3;
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'start' };

    snapToNearest(mockContainer(500), options, state);

    expect(state.targetPosition).toBe(1);
  });

  it('snaps relative to center offset when snapAlign is "center"', () => {
    const state = createInitialState();
    state.itemWidth = 200;
    state.targetPosition = 1.7;
    // offset = (500 - 190) / 2 / 200 = 0.775
    // Math.round(1.7 - 0.775) + 0.775 = Math.round(0.925) + 0.775 = 1 + 0.775 = 1.775
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'center', gap: 10 };

    snapToNearest(mockContainer(500), options, state);

    expect(state.targetPosition).toBeCloseTo(1.775);
  });

  it('does not change targetPosition when it is already perfectly snapped', () => {
    const state = createInitialState();
    state.itemWidth = 200;
    state.targetPosition = 2;
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, snapAlign: 'start' };

    snapToNearest(mockContainer(500), options, state);

    expect(state.targetPosition).toBe(2);
  });
});
