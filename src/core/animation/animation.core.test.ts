import { describe, it, expect, vi, afterEach } from 'vitest';
import { startAnimation, stopAnimation } from './animation.core';
import { createInitialState, DEFAULT_OPTIONS } from '../../types';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('stopAnimation', () => {
  it('calls cancelAnimationFrame with the stored frame id', () => {
    const cancelMock = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelMock);

    const state = createInitialState();
    state.animationFrameId = 42;

    stopAnimation(state);

    expect(cancelMock).toHaveBeenCalledWith(42);
  });

  it('sets animationFrameId to null after cancelling', () => {
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const state = createInitialState();
    state.animationFrameId = 42;

    stopAnimation(state);

    expect(state.animationFrameId).toBeNull();
  });

  it('does nothing when animationFrameId is already null', () => {
    const cancelMock = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelMock);

    const state = createInitialState(); // animationFrameId is null by default

    stopAnimation(state);

    expect(cancelMock).not.toHaveBeenCalled();
  });
});

describe('startAnimation', () => {
  it('registers a requestAnimationFrame loop and stores the frame id', () => {
    let frameId = 0;
    const rafMock = vi.fn(() => ++frameId);
    vi.stubGlobal('requestAnimationFrame', rafMock);

    const state = createInitialState();
    const container = { children: [] } as unknown as HTMLElement;

    startAnimation(container, state, DEFAULT_OPTIONS);

    expect(rafMock).toHaveBeenCalled();
    expect(state.animationFrameId).not.toBeNull();
  });

  it('sets prevTime via performance.now before the first frame', () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('performance', { now: vi.fn(() => 1234) });

    const state = createInitialState();
    state.prevTime = 0;
    const container = { children: [] } as unknown as HTMLElement;

    startAnimation(container, state, DEFAULT_OPTIONS);

    expect(state.prevTime).toBe(1234);
  });

  it('can be stopped immediately after starting', () => {
    let frameId = 0;
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => ++frameId));
    const cancelMock = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelMock);

    const state = createInitialState();
    const container = { children: [] } as unknown as HTMLElement;

    startAnimation(container, state, DEFAULT_OPTIONS);
    stopAnimation(state);

    expect(cancelMock).toHaveBeenCalled();
    expect(state.animationFrameId).toBeNull();
  });
});
