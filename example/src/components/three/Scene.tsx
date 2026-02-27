import { Canvas, CanvasProps } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from './tunnel'

const Scene = (props: CanvasProps) => {
  return (
    <Canvas
      {...props}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <r3f.Out />
      <Preload all />
    </Canvas>
  )
}

export default Scene
