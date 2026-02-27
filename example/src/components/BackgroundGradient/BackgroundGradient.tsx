import { shaderMaterial } from '@react-three/drei'
import { Vector3 } from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

import vertexShader from './glsl/gradient.vert'
import fragmentShader from './glsl/gradient.frag'

export interface Uniforms {
  uTime: number
  uColourPalette: Vector3[]
  uUvScale: number
  uUvDistortionIterations: number
  uUvDistortionIntensity: number
  uBendPower: number
  uZoomBendPower: number
  uZoomIntensity: number
  uIndex: number
}

const COLOR_PALETTE: Vector3[] = [
  new Vector3(0.5, 0.5, 1.0),
  new Vector3(1.0, 0.5, 0.5),
  new Vector3(0.5, 1.0, 0.5),
  new Vector3(1.0, 1.0, 0.5),
]

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uColourPalette: COLOR_PALETTE,
  uUvScale: 1,
  uUvDistortionIterations: 4,
  uUvDistortionIntensity: 0.2,
  uBendPower: 0,
  uZoomBendPower: 0,
  uZoomIntensity: 1,
  uIndex: 0,
}

const BackgroundMaterial = shaderMaterial(
  { ...INITIAL_UNIFORMS } as Record<string, any>,
  vertexShader,
  fragmentShader
)

extend({ BackgroundMaterial })

interface BackgroundGradientProps {
  width?: number
  height?: number
  bendPower?: number
  zoomBendPower?: number
  zoomIntensity?: number
  colourPalette?: Vector3[]
  index?: number
}

const BackgroundGradient = ({
  width = 2,
  height = 3,
  bendPower = 0,
  zoomBendPower = 0,
  zoomIntensity = 1,
  colourPalette = COLOR_PALETTE,
  index = 0,
}: BackgroundGradientProps) => {
  const materialRef = useRef<any>(null)
  const { gl } = useThree()
  const gradientItemElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gradientItemElement.current = document.getElementById(
      `view-${index}`
    ) as HTMLDivElement
  }, [index])

  useFrame(({ clock }) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime()

    const canvasElement = gl.domElement
    const bendPowerValue = canvasElement.getAttribute('data-bend-power')
    if (bendPowerValue !== null) {
      materialRef.current.uniforms.uBendPower.value = parseFloat(bendPowerValue)
    } else {
      materialRef.current.uniforms.uBendPower.value = bendPower
    }

    const zoomBendPowerValue =
      gradientItemElement.current?.dataset.zoomBendPower
    if (zoomBendPowerValue !== undefined) {
      materialRef.current.uniforms.uZoomBendPower.value =
        parseFloat(zoomBendPowerValue)
    } else {
      materialRef.current.uniforms.uZoomBendPower.value = zoomBendPower
    }

    materialRef.current.uniforms.uZoomIntensity.value = zoomIntensity
    materialRef.current.uniforms.uIndex.value = index
  })

  return (
    <mesh>
      <planeGeometry args={[width, height, 16, 16]} />
      {/* @ts-expect-error - custom shader material */}
      <backgroundMaterial
        ref={materialRef}
        uTime={0}
        uColourPalette={colourPalette}
        uIndex={index}
      />
    </mesh>
  )
}

export default BackgroundGradient
