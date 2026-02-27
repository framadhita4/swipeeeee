# swipeeeeee

A simple, performance-focused slider/swiper library for React. Built on a vanilla JS core with lerp-based animation and damping-driven momentum — no dependencies beyond React.

## Features

- Smooth lerp (linear interpolation) animation
- Damping-based momentum on release
- Optional snap-to-slide with `start` or `center` alignment
- Mouse and touch support
- Exposes internal state via `ref` for creative integrations
- Zero runtime dependencies

## Installation

```bash
npm install swipeeeeee
# or
pnpm add swipeeeeee
```

> Requires React 18+.

## Usage

```tsx
import { Swiper } from 'swipeeeeee'

export default function App() {
  return (
    <Swiper visibleSlides={3} gap={24} snap snapAlign="center">
      <div className="slide">Slide 1</div>
      <div className="slide">Slide 2</div>
      <div className="slide">Slide 3</div>
      <div className="slide">Slide 4</div>
    </Swiper>
  )
}
```

## Props

| Prop              | Type                         | Default   | Description                                                   |
| ----------------- | -----------------------      | --------- | ------------------------------------------------------------- |
| `visibleSlides`   | `number`                     | `0`       | Number of slides visible at once. Fractional values supported |
| `slideWidth`      | `number`                     | `0`       | Fixed slide width in pixels. Overrides `visibleSlides`        |
| `gap`             | `number`                     | `0`       | Gap between slides in pixels                                  |
| `snap`            | `boolean`                    | `false`   | Enable snap-to-slide                                          |
| `snapAlign`       | `'start' \| 'center'`        | `'start'` | Snap alignment anchor                                         |
| `lerpFactor`      | `number`                     | `0.1`     | Smoothing factor for animation (0–1, lower = smoother)        |
| `dragSensitivity` | `number`                     | `0.003`   | Drag distance multiplier                                      |
| `forcePower`      | `number`                     | `5`       | Multiplier applied to momentum force                          |
| `dampingPower`   | `number`                     | `1`       | Scales the damping applied on drag release                   |
| `dampingSamples` | `number`                     | `5`       | Number of drag samples used for damping calculation          |
| `className`       | `string`                     | —         | Class name applied to the container element                   |
| `style`           | `React.CSSProperties`        | —         | Inline styles for the container element                       |
| `ref`             | `React.RefObject<SwiperRef>` | —         | Ref to access internal swiper state                           |

## Accessing Internal State

Pass a `ref` to read the swiper's live state — useful for driving external effects like animations or shaders.

```tsx
import { useRef } from 'react'
import { Swiper } from 'swipeeeeee'
import type { SwiperRef } from 'swipeeeeee'

export default function App() {
  const swiperRef = useRef<SwiperRef>(null)

  useEffect(() => {
    const frame = () => {
      const state = swiperRef.current?.getState()
      console.log(state?.force) // momentum force, useful for visual effects
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [])

  return (
    <Swiper ref={swiperRef} visibleSlides={3} snap>
      {/* slides */}
    </Swiper>
  )
}
```

### `SwiperState`

| Field               | Type                | Description                              |
| ------------------- | ------------------- | ---------------------------------------- |
| `currentPosition`   | `number`            | Current interpolated position            |
| `targetPosition`    | `number`            | Target position being animated toward    |
| `isDragging`        | `boolean`           | Whether the user is actively dragging    |
| `force`             | `number`            | Current momentum force                   |
| `slideCount`        | `number`            | Total number of slides                   |
| `itemWidth`         | `number`            | Computed width of each slide             |

## Vanilla JS Core

The `SwiperCore` class is exported for use without React.

```ts
import { SwiperCore } from 'swipeeeeee'

const container = document.getElementById('swiper')!
const core = new SwiperCore(container, {
  visibleSlides: 3,
  gap: 16,
  snap: true,
  snapAlign: 'center',
  lerpFactor: 0.1,
  dragSensitivity: 0.003,
  forcePower: 5,
  dampingPower: 1,
  dampingSamples: 5,
  slideWidth: 0,
})

// Clean up
core.destroy()
```

## License

ISC
