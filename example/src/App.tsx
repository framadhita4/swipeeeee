import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import { Swiper } from 'swipeeeeee'
import type { SwiperRef } from 'swipeeeeee'
import ThreeProvider from './components/three/ThreeProvider'
import SwiperSliderItem from './components/SwiperSliderItem'

const GRADIENT_SCHEMES: Vector3[][] = [
  [
    new Vector3(1.0, 0.9, 0.5),
    new Vector3(1.0, 0.4, 0.7),
    new Vector3(0.6, 0.3, 0.9),
    new Vector3(0.5, 0.8, 0.3),
  ],
  [
    new Vector3(0.3, 0.9, 1.0),
    new Vector3(0.1, 0.3, 0.8),
    new Vector3(1.0, 0.5, 0.5),
    new Vector3(0.9, 0.9, 0.9),
  ],
  [
    new Vector3(1.0, 0.7, 0.1),
    new Vector3(0.0, 0.1, 0.8),
    new Vector3(1.0, 0.3, 0.6),
    new Vector3(0.4, 0.8, 0.9),
  ],
  [
    new Vector3(0.7, 0.4, 1.0),
    new Vector3(0.1, 0.8, 0.7),
    new Vector3(1.0, 0.6, 0.9),
    new Vector3(0.3, 0.5, 0.9),
  ],
  [
    new Vector3(1.0, 1.0, 0.2),
    new Vector3(1.0, 0.0, 1.0),
    new Vector3(0.0, 0.8, 1.0),
    new Vector3(0.8, 0.8, 0.8),
  ],
  [
    new Vector3(0.0, 0.2, 0.6),
    new Vector3(1.0, 0.2, 0.4),
    new Vector3(0.8, 0.8, 0.2),
    new Vector3(0.4, 0.0, 0.7),
  ],
  [
    new Vector3(0.9, 0.7, 1.0),
    new Vector3(0.7, 1.0, 0.9),
    new Vector3(1.0, 0.9, 0.7),
    new Vector3(0.5, 0.8, 1.0),
  ],
  [
    new Vector3(1.0, 0.3, 0.8),
    new Vector3(0.0, 0.4, 1.0),
    new Vector3(1.0, 0.8, 0.0),
    new Vector3(0.5, 0.0, 0.6),
  ],
  [
    new Vector3(0.0, 1.0, 1.0),
    new Vector3(1.0, 0.0, 1.0),
    new Vector3(1.0, 1.0, 0.0),
    new Vector3(0.7, 0.7, 0.7),
  ],
  [
    new Vector3(1.0, 0.6, 0.2),
    new Vector3(0.2, 0.5, 0.8),
    new Vector3(0.8, 0.1, 0.9),
    new Vector3(0.9, 0.9, 0.6),
  ],
]

function App() {
  const swiperRef = useRef<SwiperRef | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const updateForce = () => {
      const state = swiperRef.current?.getState() ?? { force: 0 }

      const canvasElements = document.querySelectorAll('canvas')
      canvasElements.forEach((canvas) => {
        canvas.setAttribute('data-bend-power', (-state.force).toString())
      })

      animationFrameRef.current = requestAnimationFrame(updateForce)
    }

    animationFrameRef.current = requestAnimationFrame(updateForce)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <ThreeProvider>
      <div className="demo">
        <div className="swiper-wrapper">
          <Swiper
            ref={swiperRef as React.RefObject<SwiperRef>}
            visibleSlides={3.7}
            gap={64}
            snap={true}
            snapAlign="center"
            dampingPower={1}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="slide">
                <SwiperSliderItem
                  index={index}
                  colourPalette={GRADIENT_SCHEMES[index]}
                  zoomIntensity={0.8}
                />
              </div>
            ))}
          </Swiper>
        </div>
      </div>
    </ThreeProvider>
  )
}

export default App
