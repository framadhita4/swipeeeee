import { damp } from '../../utils/math';
import { SwiperState, ResolvedSwiperOptions } from '../../types';
import { updatePositions } from '../position/position.core';

function tick(
  container: HTMLElement,
  state: SwiperState,
  options: ResolvedSwiperOptions
): void {
  const now = performance.now();
  const deltaTime = (now - state.prevTime) / 1000;
  state.prevTime = now;

  state.currentPosition = damp(
    state.currentPosition,
    state.targetPosition,
    1 / options.lerpFactor,
    deltaTime
  );

  const deltaPosition = state.currentPosition - state.prevPosition;
  state.prevPosition = state.currentPosition;
  const scaledForce = deltaPosition * options.forcePower;
  state.force = Math.max(-1, Math.min(1, scaledForce));

  updatePositions(container, state);
}

export function startAnimation(
  container: HTMLElement,
  state: SwiperState,
  options: ResolvedSwiperOptions
): void {
  state.prevTime = performance.now();

  const loop = () => {
    tick(container, state, options);
    state.animationFrameId = requestAnimationFrame(loop);
  };

  state.animationFrameId = requestAnimationFrame(loop);
}

export function stopAnimation(state: SwiperState): void {
  if (state.animationFrameId !== null) {
    cancelAnimationFrame(state.animationFrameId);
    state.animationFrameId = null;
  }
}
