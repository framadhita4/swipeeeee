import { describe, it, expect } from 'vitest';
import { measureSlides, updatePositions } from './position.core';
import { createInitialState, DEFAULT_OPTIONS, ResolvedSwiperOptions } from '../../types';

function createMockItem(rectWidth = 100) {
  return {
    style: { flexShrink: '', width: '', marginRight: '', transform: '' },
    getBoundingClientRect: () => ({ width: rectWidth }),
  } as unknown as HTMLElement;
}

function createMockContainer(items: HTMLElement[], containerWidth = 600) {
  return {
    children: items,
    getBoundingClientRect: () => ({ width: containerWidth }),
  } as unknown as HTMLElement;
}

describe('measureSlides', () => {
  it('does nothing when container has no children', () => {
    const state = createInitialState();
    const container = createMockContainer([]);

    measureSlides(container, state, DEFAULT_OPTIONS);

    expect(state.slideCount).toBe(0);
    expect(state.itemWidth).toBe(0);
  });

  it('sets slideCount to the number of children', () => {
    const state = createInitialState();
    const items = [createMockItem(), createMockItem(), createMockItem()];
    const container = createMockContainer(items);
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, slideWidth: 200, gap: 0 };

    measureSlides(container, state, options);

    expect(state.slideCount).toBe(3);
  });

  it('calculates itemWidth from visibleSlides and containerWidth', () => {
    const state = createInitialState();
    const items = [createMockItem(), createMockItem()];
    // containerWidth=610, visibleSlides=2, gap=10
    // slideWidth = (610 - (2-1)*10) / 2 = 300
    // itemWidth = 300 + 10 = 310
    const container = createMockContainer(items, 610);
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, visibleSlides: 2, gap: 10 };

    measureSlides(container, state, options);

    expect(state.itemWidth).toBe(310);
  });

  it('calculates itemWidth from explicit slideWidth option', () => {
    const state = createInitialState();
    const items = [createMockItem(), createMockItem()];
    const container = createMockContainer(items);
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, slideWidth: 200, gap: 15 };

    measureSlides(container, state, options);

    // itemWidth = 200 + 15 = 215
    expect(state.itemWidth).toBe(215);
  });

  it('falls back to the first item getBoundingClientRect width when slideWidth and visibleSlides are 0', () => {
    const state = createInitialState();
    const items = [createMockItem(150), createMockItem(150)];
    const container = createMockContainer(items);
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, slideWidth: 0, visibleSlides: 0, gap: 5 };

    measureSlides(container, state, options);

    // itemWidth = 150 + 5 = 155
    expect(state.itemWidth).toBe(155);
  });

  it('sets item width styles when slideWidth is determined', () => {
    const state = createInitialState();
    const items = [createMockItem(), createMockItem()];
    const container = createMockContainer(items);
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, slideWidth: 200, gap: 10 };

    measureSlides(container, state, options);

    expect(items[0].style.width).toBe('200px');
    expect(items[1].style.width).toBe('200px');
  });

  it('sets flexShrink to "0" on all items', () => {
    const state = createInitialState();
    const items = [createMockItem(), createMockItem()];
    const container = createMockContainer(items);
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, slideWidth: 100, gap: 0 };

    measureSlides(container, state, options);

    expect(items[0].style.flexShrink).toBe('0');
    expect(items[1].style.flexShrink).toBe('0');
  });

  it('sets marginRight on all items except the last', () => {
    const state = createInitialState();
    const items = [createMockItem(), createMockItem(), createMockItem()];
    const container = createMockContainer(items);
    const options: ResolvedSwiperOptions = { ...DEFAULT_OPTIONS, slideWidth: 100, gap: 20 };

    measureSlides(container, state, options);

    expect(items[0].style.marginRight).toBe('20px');
    expect(items[1].style.marginRight).toBe('20px');
    expect(items[2].style.marginRight).toBe('0');
  });
});

describe('updatePositions', () => {
  it('does nothing when slideCount is 0', () => {
    const state = createInitialState(); // slideCount = 0
    const items = [createMockItem(), createMockItem()];
    const container = createMockContainer(items);

    updatePositions(container, state);

    expect(items[0].style.transform).toBe('');
    expect(items[1].style.transform).toBe('');
  });

  it('positions all visible slides at translateX(0px) when currentPosition is 0', () => {
    const state = createInitialState();
    state.slideCount = 3;
    state.itemWidth = 100;
    state.currentPosition = 0;
    const items = [createMockItem(), createMockItem(), createMockItem()];
    const container = createMockContainer(items);

    updatePositions(container, state);

    // slide 0: symmetricMod(0, 3)=0 → x=0 → translateX=0
    // slide 1: symmetricMod(1, 3)=1 → x=0 → translateX=0
    // slide 2: symmetricMod(2, 3)=-1 → x=-1-2=-3 → translateX=-300 (wraps behind)
    expect(items[0].style.transform).toBe('translateX(0px)');
    expect(items[1].style.transform).toBe('translateX(0px)');
    expect(items[2].style.transform).toBe('translateX(-300px)');
  });

  it('shifts all slides by itemWidth when currentPosition advances by 1', () => {
    const state = createInitialState();
    state.slideCount = 3;
    state.itemWidth = 100;
    state.currentPosition = 1;
    const items = [createMockItem(), createMockItem(), createMockItem()];
    const container = createMockContainer(items);

    updatePositions(container, state);

    // slide 0: symmetricMod(1, 3)=1 → x=1-0=1 → translateX=100
    // slide 1: symmetricMod(2, 3)=-1 → x=-1-1=-2 → translateX=-200
    // slide 2: symmetricMod(3, 3)=0 → x=0-2=-2 → translateX=-200
    expect(items[0].style.transform).toBe('translateX(100px)');
    expect(items[1].style.transform).toBe('translateX(-200px)');
    expect(items[2].style.transform).toBe('translateX(-200px)');
  });
});
