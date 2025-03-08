import React, { useState, useEffect } from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'

type Props = React.PropsWithChildren<{
  checkVisibility?: boolean
  loadMore?: () => void
}>

const VisibilitySensor = React.forwardRef(({ checkVisibility, loadMore, children }: Props, ref) => {
  const [active, setActive] = useState(checkVisibility)

  useEffect(() => {
    // reset trigger
    setActive(checkVisibility)
  }, [checkVisibility])

  return (
    <ReactVisibilitySensor
      containment={ref}
      partialVisibility
      active={active}
      onChange={(visible: boolean) => {
        if (visible) {
          // trigger should be called only once
          setActive(false)
          loadMore?.()
        }
      }}
    >
      {children}
    </ReactVisibilitySensor>
  )
});

VisibilitySensor.displayName = 'VisibilitySensor';

export default VisibilitySensor