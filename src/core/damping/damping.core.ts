import { ResolvedSwiperOptions, SwiperState } from '../../types';

export function recordDragSample(state: SwiperState, options: ResolvedSwiperOptions): void {
  const sample = { position: state.targetPosition, time: performance.now() };
  state.dragSamples.push(sample);
  if (state.dragSamples.length > options.dampingSamples) {
    state.dragSamples.shift();
  }
}

export function applyDamping(state: SwiperState, options: ResolvedSwiperOptions): void {
  if (options.dampingPower === 0 || state.dragSamples.length < 2) {
    state.dragSamples = [];
    return;
  }

  const newest = state.dragSamples[state.dragSamples.length - 1];
  const oldest = state.dragSamples[0];
  const dt = newest.time - oldest.time;

  if (dt <= 0) {
    state.dragSamples = [];
    return;
  }

  const damping = (newest.position - oldest.position) / dt;
  state.targetPosition += damping * options.dampingPower * 100;
  state.dragSamples = [];
}
