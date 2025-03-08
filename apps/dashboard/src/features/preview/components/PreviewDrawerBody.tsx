import React, { useEffect } from 'react'
import {
  WebPreview,
} from './WebPreview'

export const PreviewDrawerBodyInner = () => {
  useEffect(() => {
    console.warn('PreviewDrawerBodyInner remount')
  }, [])

  return <WebPreview />
}

export const PreviewDrawerBody = React.memo(PreviewDrawerBodyInner);

