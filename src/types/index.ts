export interface SwiperOptions {
  slideWidth?: number;
  visibleSlides?: number;
  gap?: number;
  dragSensitivity?: number;
  lerpFactor?: number;
  forcePower?: number;
  snap?: boolean;
  snapAlign?: 'start' | 'center';
  dampingPower?: number;
  dampingSamples?: number;
}

export type ResolvedSwiperOptions = Required<SwiperOptions>;

export interface DragSample {
  position: number;
  time: number;
}

export interface SwiperState {
  currentPosition: number;
  targetPosition: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartPosition: number;
  animationFrameId: number | null;
  prevTime: number;
  prevPosition: number;
  slideCount: number;
  itemWidth: number;
  force: number;
  dragSamples: DragSample[];
}

export const DEFAULT_OPTIONS: ResolvedSwiperOptions = {
  slideWidth: 0,
  visibleSlides: 0,
  gap: 0,
  dragSensitivity: 0.003,
  lerpFactor: 0.1,
  forcePower: 5,
  snap: false,
  snapAlign: 'start',
  dampingPower: 1,
  dampingSamples: 5,
};

export function createInitialState(): SwiperState {
  return {
    currentPosition: 0,
    targetPosition: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartPosition: 0,
    animationFrameId: null,
    prevTime: typeof performance !== 'undefined' ? performance.now() : 0,
    prevPosition: 0,
    slideCount: 0,
    itemWidth: 0,
    force: 0,
    dragSamples: [],
  };
}
