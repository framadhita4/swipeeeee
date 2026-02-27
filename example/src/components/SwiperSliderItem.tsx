import { Vector3 } from 'three'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { lerp } from 'three/src/math/MathUtils.js'
import View from './three/View'
import BackgroundGradient from './BackgroundGradient/BackgroundGradient'

interface Props {
  index: number
  colourPalette: Vector3[]
  zoomIntensity?: number
}

const SCALE = 0.8
const DELAY_MS = 100

const InViewObserver = ({
  viewRef,
}: {
  viewRef: React.RefObject<HTMLDivElement | null>
}) => {
  const isInViewRef = useRef(false)
  const inViewTimestamp = useRef<number | null>(null)
  const currentZoomBendPower = useRef(0)
  const { clock } = useThree()

  useEffect(() => {
    const node = viewRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInViewRef.current) {
          inViewTimestamp.current = clock.getElapsedTime()
        } else if (!entry.isIntersecting && isInViewRef.current) {
          inViewTimestamp.current = null
        }
        isInViewRef.current = entry.isIntersecting
      },
      { rootMargin: '0px -400px 0px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [clock, viewRef])

  useFrame(() => {
    const currentTime = clock.getElapsedTime()
    let targetZoomBendPower = 0

    if (isInViewRef.current && inViewTimestamp.current !== null) {
      const elapsedTime = (currentTime - inViewTimestamp.current) * 1000
      if (elapsedTime >= DELAY_MS) {
        targetZoomBendPower = 1
      }
    }

    currentZoomBendPower.current = lerp(
      currentZoomBendPower.current,
      targetZoomBendPower,
      0.1
    )

    if (viewRef.current) {
      viewRef.current.dataset.zoomBendPower =
        currentZoomBendPower.current.toString()
    }
  })

  return null
}

const SwiperSliderItem = ({ index, colourPalette, zoomIntensity = 1 }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <View
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        transform: 'scale(2)',
      }}
      id={`view-${index}`}
    >
      <BackgroundGradient
        width={3 * SCALE}
        height={4.3 * SCALE}
        colourPalette={colourPalette}
        index={index}
        zoomIntensity={zoomIntensity}
      />
      <InViewObserver viewRef={ref as React.RefObject<HTMLDivElement>} />
    </View>
  )
}

export default SwiperSliderItem
