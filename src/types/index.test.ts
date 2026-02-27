import { describe, it, expect } from 'vitest';
import { createInitialState } from './index';

describe('createInitialState', () => {
  it('initializes all fields to their zero/falsy defaults', () => {
    const state = createInitialState();

    expect(state.currentPosition).toBe(0);
    expect(state.targetPosition).toBe(0);
    expect(state.isDragging).toBe(false);
    expect(state.dragStartX).toBe(0);
    expect(state.dragStartPosition).toBe(0);
    expect(state.animationFrameId).toBeNull();
    expect(state.prevPosition).toBe(0);
    expect(state.slideCount).toBe(0);
    expect(state.itemWidth).toBe(0);
    expect(state.force).toBe(0);
    expect(state.dragSamples).toEqual([]);
  });

  it('returns a new independent object on each call', () => {
    const state1 = createInitialState();
    const state2 = createInitialState();

    expect(state1).not.toBe(state2);
  });

  it('returns independent dragSamples arrays', () => {
    const state1 = createInitialState();
    const state2 = createInitialState();

    state1.dragSamples.push({ position: 1, time: 100 });

    expect(state2.dragSamples).toHaveLength(0);
  });
});
