import { ResolvedSwiperOptions, SwiperState } from '@/types';

export function getSnapOffset(
  container: HTMLElement,
  options: ResolvedSwiperOptions,
  state: SwiperState,
): number {
  if (options.snapAlign !== 'center' || state.itemWidth === 0) return 0;
  const containerWidth = container.getBoundingClientRect().width;
  const slideWidth = state.itemWidth - options.gap;
  return (containerWidth - slideWidth) / 2 / state.itemWidth;
}

export function snapToNearest(
  container: HTMLElement,
  options: ResolvedSwiperOptions,
  state: SwiperState,
): void {
  const offset = getSnapOffset(container, options, state);
  state.targetPosition = Math.round(state.targetPosition - offset) + offset;
}
