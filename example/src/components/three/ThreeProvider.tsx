import { useRef } from 'react'
import Scene from './Scene'

const ThreeProvider = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
      {children}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref as React.RefObject<HTMLElement>}
        eventPrefix="client"
      />
    </div>
  )
}

export default ThreeProvider
