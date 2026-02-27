import { describe, it, expect } from 'vitest';
import { recordDragSample, applyVelocity } from './velocity.core';
import { createInitialState, DEFAULT_OPTIONS } from '../../types';

describe('recordDragSample', () => {
  it('pushes a sample with the current targetPosition', () => {
    const state = createInitialState();
    state.targetPosition = 3;

    recordDragSample(state, DEFAULT_OPTIONS);

    expect(state.dragSamples).toHaveLength(1);
    expect(state.dragSamples[0].position).toBe(3);
  });

  it('records a timestamp on each sample', () => {
    const state = createInitialState();

    recordDragSample(state, DEFAULT_OPTIONS);

    expect(typeof state.dragSamples[0].time).toBe('number');
  });

  it('accumulates samples up to the velocitySamples limit', () => {
    const state = createInitialState();
    const options = { ...DEFAULT_OPTIONS, velocitySamples: 3 };

    for (let i = 0; i < 3; i++) {
      state.targetPosition = i;
      recordDragSample(state, options);
    }

    expect(state.dragSamples).toHaveLength(3);
  });

  it('drops the oldest sample once the limit is exceeded', () => {
    const state = createInitialState();
    const options = { ...DEFAULT_OPTIONS, velocitySamples: 3 };

    for (let i = 0; i < 5; i++) {
      state.targetPosition = i;
      recordDragSample(state, options);
    }

    expect(state.dragSamples).toHaveLength(3);
    // positions 0,1 were dropped; 2,3,4 remain
    expect(state.dragSamples[0].position).toBe(2);
    expect(state.dragSamples[2].position).toBe(4);
  });
});

describe('applyVelocity', () => {
  it('clears samples without moving when velocityPower is 0', () => {
    const state = createInitialState();
    state.dragSamples = [
      { position: 0, time: 0 },
      { position: 1, time: 100 },
    ];
    state.targetPosition = 5;

    applyVelocity(state, { ...DEFAULT_OPTIONS, velocityPower: 0 });

    expect(state.dragSamples).toHaveLength(0);
    expect(state.targetPosition).toBe(5);
  });

  it('clears samples without moving when fewer than 2 samples', () => {
    const state = createInitialState();
    state.dragSamples = [{ position: 0, time: 0 }];
    state.targetPosition = 5;

    applyVelocity(state, DEFAULT_OPTIONS);

    expect(state.dragSamples).toHaveLength(0);
    expect(state.targetPosition).toBe(5);
  });

  it('clears samples without moving when dt is 0', () => {
    const state = createInitialState();
    state.dragSamples = [
      { position: 0, time: 100 },
      { position: 1, time: 100 }, // same timestamp → dt=0
    ];
    state.targetPosition = 5;

    applyVelocity(state, DEFAULT_OPTIONS);

    expect(state.dragSamples).toHaveLength(0);
    expect(state.targetPosition).toBe(5);
  });

  it('applies positive velocity to targetPosition', () => {
    const state = createInitialState();
    // velocity = (1 - 0) / 100ms = 0.01; added = 0.01 * 1 * 100 = 1
    state.dragSamples = [
      { position: 0, time: 0 },
      { position: 1, time: 100 },
    ];
    state.targetPosition = 1;

    applyVelocity(state, { ...DEFAULT_OPTIONS, velocityPower: 1 });

    expect(state.targetPosition).toBeCloseTo(2);
    expect(state.dragSamples).toHaveLength(0);
  });

  it('applies negative velocity to targetPosition', () => {
    const state = createInitialState();
    // velocity = (0 - 1) / 100ms = -0.01; added = -0.01 * 1 * 100 = -1
    state.dragSamples = [
      { position: 1, time: 0 },
      { position: 0, time: 100 },
    ];
    state.targetPosition = 0;

    applyVelocity(state, { ...DEFAULT_OPTIONS, velocityPower: 1 });

    expect(state.targetPosition).toBeCloseTo(-1);
    expect(state.dragSamples).toHaveLength(0);
  });

  it('scales the applied momentum by velocityPower', () => {
    const state1 = createInitialState();
    state1.dragSamples = [{ position: 0, time: 0 }, { position: 1, time: 100 }];
    state1.targetPosition = 0;
    applyVelocity(state1, { ...DEFAULT_OPTIONS, velocityPower: 2 });

    const state2 = createInitialState();
    state2.dragSamples = [{ position: 0, time: 0 }, { position: 1, time: 100 }];
    state2.targetPosition = 0;
    applyVelocity(state2, { ...DEFAULT_OPTIONS, velocityPower: 1 });

    expect(state1.targetPosition).toBeCloseTo(state2.targetPosition * 2);
  });
});
