import { useEffect, useRef, useState } from 'react'
import { Bot, BotProps } from '../../../components/Bot'
import styles from '../../../assets/index.css'

const hostElementCss = `
:host {
  display: block;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
`

export const Standard: React.FC<BotProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isBotDisplayed, setIsBotDisplayed] = useState(false)

  const launchBot = () => {
    setIsBotDisplayed(true)
  }

  useEffect(() => {
    if (!ref.current) return
    const botLauncherObserver = new IntersectionObserver((intersections) => {
      if (intersections.some((intersection) => intersection.isIntersecting))
        launchBot()
    })
    botLauncherObserver.observe(ref.current)
    return () => botLauncherObserver.disconnect()
  }, [ref])

  return (
    <>
      <style> {hostElementCss} </style>
      <style> {styles} </style>
      <div ref={ref} className='w-full h-full openbot-standard-container'>
        {
          isBotDisplayed &&
          <Bot {...props} />
        }
      </div>
    </>
  )
}
