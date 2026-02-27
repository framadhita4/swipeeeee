import { forwardRef, useRef } from 'react'
import { View as ViewImpl } from '@react-three/drei'
import { Three } from './Three'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const View = forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement>(null)

    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node
      if (!forwardedRef) return
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else {
        forwardedRef.current = node
      }
    }

    return (
      <>
        <div ref={setRefs} {...props} />
        <Three>
          <ViewImpl track={localRef as React.RefObject<HTMLElement>}>
            {children}
          </ViewImpl>
        </Three>
      </>
    )
  }
)
View.displayName = 'View'

export default View
