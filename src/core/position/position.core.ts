import { symmetricMod } from '../../utils/math';
import { ResolvedSwiperOptions, SwiperState } from '../../types';

export function measureSlides(
  container: HTMLElement,
  state: SwiperState,
  options: ResolvedSwiperOptions
): void {
  const items = Array.from(container.children) as HTMLElement[];
  if (items.length === 0) return;

  const { gap, visibleSlides } = options;
  let { slideWidth } = options;

  if (visibleSlides > 0) {
    const containerWidth = container.getBoundingClientRect().width;
    slideWidth = (containerWidth - (visibleSlides - 1) * gap) / visibleSlides;
  }

  state.slideCount = items.length;
  state.itemWidth =
    slideWidth > 0
      ? slideWidth + gap
      : items[0].getBoundingClientRect().width + gap;

  items.forEach((item, index) => {
    item.style.flexShrink = '0';
    if (slideWidth > 0) {
      item.style.width = `${slideWidth}px`;
    }
    item.style.marginRight = index < items.length - 1 ? `${gap}px` : '0';
  });
}

export function updatePositions(container: HTMLElement, state: SwiperState): void {
  if (state.slideCount === 0) return;

  const items = Array.from(container.children) as HTMLElement[];

  items.forEach((item, index) => {
    const unitPos = state.currentPosition + index;
    const wrappedPos = symmetricMod(unitPos, state.slideCount);
    const x = wrappedPos - index;
    const translateX = x * state.itemWidth;
    item.style.transform = `translateX(${translateX}px)`;
  });
}
