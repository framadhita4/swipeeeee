import { SwiperState, ResolvedSwiperOptions, createInitialState } from '../types';
import { measureSlides, updatePositions } from './position/position.core';
import { startAnimation, stopAnimation } from './animation/animation.core';
import { getSnapOffset, snapToNearest } from './snap/snap.core';
import { applyDamping, recordDragSample } from './damping/damping.core';

export class SwiperCore {
  private container: HTMLElement;
  private state: SwiperState;
  private options: ResolvedSwiperOptions;
  private unbindDrag: (() => void) | null = null;

  constructor(container: HTMLElement, options: ResolvedSwiperOptions) {
    this.container = container;
    this.options = options;
    this.state = createInitialState();

    this.applyContainerStyles();
    this.measure();
    this.initPosition();
    this.unbindDrag = this.bindEvents();
    startAnimation(this.container, this.state, this.options);
  }

  private applyContainerStyles(): void {
    this.container.style.display = 'flex';
    this.container.style.overflow = 'hidden';
    this.container.style.cursor = 'grab';
    this.container.style.touchAction = 'pan-y';
  }
  
  bindEvents(): () => void {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('mouseleave', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);

    return () => {
      this.container.removeEventListener('mousedown', this.onMouseDown);
      this.container.removeEventListener('mouseleave', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      this.container.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
    };
  }

  // DRAG EVENTS
  onMouseDown(e: MouseEvent) {
    this.state.isDragging = true;
    this.state.dragStartX = e.clientX;
    this.state.dragStartPosition = this.state.targetPosition;
    this.state.dragSamples = [];
    this.container.style.cursor = 'grabbing';
  };

  onMouseMove(e: MouseEvent) {
    if (!this.state.isDragging) return;
    const deltaX = (e.clientX - this.state.dragStartX) * this.options.dragSensitivity;
    this.state.targetPosition = this.state.dragStartPosition + deltaX;
    recordDragSample(this.state, this.options);
  };

  onMouseUp() {
    if (!this.state.isDragging) return;
    this.state.isDragging = false;
    this.container.style.cursor = 'grab';
    applyDamping(this.state, this.options);
    if (this.options.snap) {
      snapToNearest(this.container, this.options, this.state);
    }
  };

  onTouchStart(e: TouchEvent) {
    this.state.isDragging = true;
    this.state.dragStartX = e.touches[0].clientX;
    this.state.dragStartPosition = this.state.targetPosition;
    this.state.dragSamples = [];
  };

  onTouchMove(e: TouchEvent) {
    if (!this.state.isDragging) return;
    e.preventDefault();
    const deltaX = (e.touches[0].clientX - this.state.dragStartX) * this.options.dragSensitivity;
    this.state.targetPosition = this.state.dragStartPosition + deltaX;
    recordDragSample(this.state, this.options);
  };

  onTouchEnd() {
    if (!this.state.isDragging) return;
    this.state.isDragging = false;
    applyDamping(this.state, this.options);
    if (this.options.snap) {
      snapToNearest(this.container, this.options, this.state);
    }
  };

  // INITIAL POSITION
  private initPosition(): void {
    const offset = getSnapOffset(this.container, this.options, this.state);
    this.state.targetPosition = offset;
    this.state.currentPosition = offset;
    this.state.prevPosition = offset;
    updatePositions(this.container, this.state);
  }

  // MEASUREMENT
  measure(): void {
    measureSlides(this.container, this.state, this.options);
    updatePositions(this.container, this.state);
  }

  getState(): SwiperState {
    return this.state;
  }

  destroy(): void {
    stopAnimation(this.state);
    this.unbindDrag?.();
    this.unbindDrag = null;
  }
}
